// Supabase Edge Function: Generate Analytics Report
// Generates comprehensive analytics for dashboard

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyticsRequest {
  period: 'today' | 'week' | 'month' | 'quarter' | 'year'
  zoneId?: string
  departmentId?: string
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

    const { period, zoneId, departmentId }: AnalyticsRequest = await req.json()

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Build query filter
    let complaintQuery = supabaseClient
      .from('complaints')
      .select('*')
      .gte('created_at', startDate.toISOString())

    if (zoneId) {
      complaintQuery = complaintQuery.eq('zone_id', zoneId)
    }

    const { data: complaints, error: complaintsError } = await complaintQuery

    if (complaintsError) {
      throw complaintsError
    }

    // Calculate statistics
    const totalComplaints = complaints?.length || 0
    const statusCounts = {
      new: complaints?.filter(c => c.status === 'new').length || 0,
      assigned: complaints?.filter(c => c.status === 'assigned').length || 0,
      in_progress: complaints?.filter(c => c.status === 'in_progress').length || 0,
      completed: complaints?.filter(c => c.status === 'completed').length || 0,
      cancelled: complaints?.filter(c => c.status === 'cancelled').length || 0,
    }

    const priorityCounts = {
      urgent: complaints?.filter(c => c.priority === 'urgent').length || 0,
      high: complaints?.filter(c => c.priority === 'high').length || 0,
      medium: complaints?.filter(c => c.priority === 'medium').length || 0,
      low: complaints?.filter(c => c.priority === 'low').length || 0,
    }

    // Calculate average resolution time
    const completedComplaints = complaints?.filter(
      c => c.status === 'completed' && c.actual_completion
    ) || []
    
    const avgResolutionTime = completedComplaints.length > 0
      ? completedComplaints.reduce((acc, c) => {
          const created = new Date(c.created_at).getTime()
          const completed = new Date(c.actual_completion).getTime()
          return acc + (completed - created)
        }, 0) / completedComplaints.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0

    // Calculate satisfaction score
    const ratedComplaints = complaints?.filter(c => c.citizen_rating) || []
    const avgSatisfaction = ratedComplaints.length > 0
      ? ratedComplaints.reduce((acc, c) => acc + c.citizen_rating, 0) / ratedComplaints.length
      : 0

    // Get category distribution
    const { data: categories, error: catError } = await supabaseClient
      .from('complaint_categories')
      .select('*')

    const categoryDistribution = categories?.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: complaints?.filter(c => c.category_id === cat.id).length || 0,
      color: cat.color,
    })).sort((a, b) => b.count - a.count) || []

    // Get department performance
    const { data: departments } = await supabaseClient
      .from('departments')
      .select('id, name, code')

    const departmentPerformance = departments?.map(dept => {
      const deptCategories = categories?.filter(c => c.department_id === dept.id) || []
      const deptCategoryIds = deptCategories.map(c => c.id)
      const deptComplaints = complaints?.filter(c => deptCategoryIds.includes(c.category_id)) || []
      const deptCompleted = deptComplaints.filter(c => c.status === 'completed')
      
      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        total: deptComplaints.length,
        completed: deptCompleted.length,
        pending: deptComplaints.length - deptCompleted.length,
        efficiency: deptComplaints.length > 0 
          ? Math.round((deptCompleted.length / deptComplaints.length) * 100) 
          : 0,
      }
    }).sort((a, b) => b.efficiency - a.efficiency) || []

    // Get top performing employees
    const { data: employees } = await supabaseClient
      .from('users')
      .select('id, name, avatar')
      .eq('role', 'employee')
      .eq('is_active', true)
      .limit(10)

    const employeePerformance = await Promise.all(
      (employees || []).map(async emp => {
        const { data: assignments } = await supabaseClient
          .from('work_assignments')
          .select('*')
          .eq('employee_id', emp.id)
          .gte('created_at', startDate.toISOString())

        const completed = assignments?.filter(a => a.status === 'completed').length || 0
        const total = assignments?.length || 0

        return {
          id: emp.id,
          name: emp.name,
          avatar: emp.avatar,
          completedTasks: completed,
          totalTasks: total,
          efficiency: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      })
    )

    const topEmployees = employeePerformance
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 5)

    // Get trend data (last 7 days or months depending on period)
    const trendData = []
    const trendPeriods = period === 'year' ? 12 : period === 'quarter' ? 12 : 7
    
    for (let i = trendPeriods - 1; i >= 0; i--) {
      let periodStart: Date
      let periodEnd: Date
      let label: string

      if (period === 'year' || period === 'quarter') {
        periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
        periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
        label = periodStart.toLocaleString('default', { month: 'short' })
      } else {
        periodStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000 - 1)
        label = periodStart.toLocaleString('default', { weekday: 'short' })
      }

      const periodComplaints = complaints?.filter(c => {
        const created = new Date(c.created_at)
        return created >= periodStart && created <= periodEnd
      }) || []

      const periodResolved = periodComplaints.filter(c => c.status === 'completed')

      trendData.push({
        label,
        received: periodComplaints.length,
        resolved: periodResolved.length,
      })
    }

    const analytics = {
      overview: {
        totalComplaints,
        pendingComplaints: statusCounts.new + statusCounts.assigned + statusCounts.in_progress,
        resolvedComplaints: statusCounts.completed,
        avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
        satisfactionScore: Math.round(avgSatisfaction * 10) / 10,
      },
      statusDistribution: statusCounts,
      priorityDistribution: priorityCounts,
      categoryDistribution,
      departmentPerformance,
      topEmployees,
      trendData,
      period,
      generatedAt: new Date().toISOString(),
    }

    return new Response(
      JSON.stringify(analytics),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate analytics' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
