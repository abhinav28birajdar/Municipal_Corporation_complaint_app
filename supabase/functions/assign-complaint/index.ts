// Supabase Edge Function: Assign Complaint
// Automatically assigns complaints to available employees based on area and workload

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AssignmentRequest {
  complaintId: string
  employeeId?: string // Optional - if not provided, auto-assign
  assignedBy: string
  notes?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { complaintId, employeeId, assignedBy, notes }: AssignmentRequest = await req.json()

    // Validate complaint exists and is not already assigned
    const { data: complaint, error: complaintError } = await supabaseClient
      .from('complaints')
      .select('*, complaint_categories(*)')
      .eq('id', complaintId)
      .single()

    if (complaintError || !complaint) {
      return new Response(
        JSON.stringify({ error: 'Complaint not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (complaint.status !== 'new' && complaint.status !== 'reopened') {
      return new Response(
        JSON.stringify({ error: 'Complaint is already assigned or completed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let targetEmployeeId = employeeId

    // Auto-assign if no employee specified
    if (!targetEmployeeId) {
      // Find available employees in the same area/department with lowest workload
      const { data: employees, error: empError } = await supabaseClient
        .from('users')
        .select(`
          id,
          name,
          department,
          area_assigned,
          work_assignments(count)
        `)
        .eq('role', 'employee')
        .eq('is_active', true)
        .eq('department', complaint.complaint_categories?.department_id)

      if (empError || !employees?.length) {
        return new Response(
          JSON.stringify({ error: 'No available employees found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Sort by workload (least work first)
      employees.sort((a, b) => {
        const aCount = a.work_assignments?.[0]?.count || 0
        const bCount = b.work_assignments?.[0]?.count || 0
        return aCount - bCount
      })

      targetEmployeeId = employees[0].id
    }

    // Create work assignment
    const { data: assignment, error: assignError } = await supabaseClient
      .from('work_assignments')
      .insert({
        complaint_id: complaintId,
        employee_id: targetEmployeeId,
        assigned_by: assignedBy,
        title: complaint.title,
        description: complaint.description,
        priority: complaint.priority,
        location_address: complaint.location_address,
        location_coordinates: complaint.location_coordinates,
        area_id: complaint.area_id,
        notes: notes,
      })
      .select()
      .single()

    if (assignError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create assignment', details: assignError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update complaint status
    const { error: updateError } = await supabaseClient
      .from('complaints')
      .update({
        status: 'assigned',
        assigned_to: targetEmployeeId,
        assigned_by: assignedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', complaintId)

    if (updateError) {
      console.error('Failed to update complaint status:', updateError)
    }

    // Add status history entry
    await supabaseClient.from('complaint_status_history').insert({
      complaint_id: complaintId,
      status: 'assigned',
      changed_by: assignedBy,
      notes: `Assigned to employee${notes ? ': ' + notes : ''}`,
    })

    // Send notification to employee
    await supabaseClient.from('notifications').insert({
      user_id: targetEmployeeId,
      title: 'New Task Assigned',
      message: `You have been assigned a new complaint: ${complaint.title}`,
      type: 'work_assignment',
      reference_id: complaintId,
      reference_type: 'complaint',
    })

    // Send notification to citizen
    await supabaseClient.from('notifications').insert({
      user_id: complaint.citizen_id,
      title: 'Complaint Assigned',
      message: `Your complaint #${complaint.complaint_number} has been assigned to an officer`,
      type: 'complaint',
      reference_id: complaintId,
      reference_type: 'complaint',
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        assignment,
        message: 'Complaint assigned successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
