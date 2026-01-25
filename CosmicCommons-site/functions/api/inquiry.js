/**
 * C3 Alliance Investor Portal - Inquiry API
 * Handles investor inquiry form submissions
 * Stores in D1 database and sends notification
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.peak) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, peak' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Insert into D1 database
    const result = await env.DB.prepare(`
      INSERT INTO investor_inquiries (
        peak, name, email, organization, accredited_status, 
        investment_range, message, referral_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.peak,
      data.name,
      data.email,
      data.organization || null,
      data.accredited_status || null,
      data.investment_range || null,
      data.message || null,
      data.referral_source || null
    ).run();
    
    // Log for monitoring
    console.log(`New inquiry from ${data.email} for ${data.peak}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Inquiry submitted successfully',
        id: result.meta.last_row_id
      }),
      { status: 200, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Inquiry submission error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to submit inquiry. Please try again.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
