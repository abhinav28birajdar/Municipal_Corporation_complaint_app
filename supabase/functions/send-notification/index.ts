// Supabase Edge Function: Send Push Notification
// Handles sending push notifications via FCM

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  userId?: string
  userIds?: string[]
  role?: 'citizen' | 'employee' | 'head' | 'admin' | 'all'
  title: string
  body: string
  data?: Record<string, string>
  imageUrl?: string
  type?: 'complaint' | 'work_assignment' | 'program' | 'announcement' | 'system'
  referenceId?: string
  referenceType?: string
}

async function sendFCMNotification(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>,
  imageUrl?: string
) {
  const fcmKey = Deno.env.get('FCM_SERVER_KEY')
  
  if (!fcmKey) {
    console.error('FCM_SERVER_KEY not configured')
    return { success: false, error: 'FCM not configured' }
  }

  const message = {
    registration_ids: tokens,
    notification: {
      title,
      body,
      image: imageUrl,
      sound: 'default',
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    },
    data: {
      ...data,
      title,
      body,
    },
    priority: 'high',
    content_available: true,
  }

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${fcmKey}`,
      },
      body: JSON.stringify(message),
    })

    const result = await response.json()
    return { success: true, result }
  } catch (error) {
    console.error('FCM Error:', error)
    return { success: false, error: error.message }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const {
      userId,
      userIds,
      role,
      title,
      body,
      data,
      imageUrl,
      type = 'system',
      referenceId,
      referenceType,
    }: NotificationRequest = await req.json()

    if (!title || !body) {
      return new Response(
        JSON.stringify({ error: 'Title and body are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Collect target user IDs
    let targetUserIds: string[] = []

    if (userId) {
      targetUserIds = [userId]
    } else if (userIds?.length) {
      targetUserIds = userIds
    } else if (role) {
      // Fetch users by role
      let query = supabaseClient
        .from('users')
        .select('id')
        .eq('is_active', true)
        .not('fcm_token', 'is', null)

      if (role !== 'all') {
        query = query.eq('role', role)
      }

      const { data: users, error } = await query

      if (error) {
        throw error
      }

      targetUserIds = users?.map(u => u.id) || []
    }

    if (!targetUserIds.length) {
      return new Response(
        JSON.stringify({ error: 'No target users specified or found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get FCM tokens for target users
    const { data: users, error: usersError } = await supabaseClient
      .from('users')
      .select('id, fcm_token')
      .in('id', targetUserIds)
      .not('fcm_token', 'is', null)

    if (usersError) {
      throw usersError
    }

    const tokens = users
      ?.map(u => u.fcm_token)
      .filter((t): t is string => !!t) || []

    // Store notifications in database
    const notificationRecords = targetUserIds.map(uid => ({
      user_id: uid,
      title,
      message: body,
      type,
      reference_id: referenceId,
      reference_type: referenceType,
      is_read: false,
    }))

    const { error: insertError } = await supabaseClient
      .from('notifications')
      .insert(notificationRecords)

    if (insertError) {
      console.error('Failed to store notifications:', insertError)
    }

    // Send push notifications if tokens exist
    let pushResult = { success: true, sent: 0 }
    
    if (tokens.length > 0) {
      // FCM has a limit of 1000 tokens per request
      const batchSize = 500
      let totalSent = 0

      for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize)
        const result = await sendFCMNotification(
          batch,
          title,
          body,
          {
            ...data,
            type,
            referenceId: referenceId || '',
            referenceType: referenceType || '',
          },
          imageUrl
        )

        if (result.success) {
          totalSent += batch.length
        }
      }

      pushResult = { success: true, sent: totalSent }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notifications sent successfully',
        stats: {
          targetUsers: targetUserIds.length,
          storedNotifications: notificationRecords.length,
          pushNotificationsSent: pushResult.sent,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send notifications' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
