const supabaseUrl = 'https://mdttowcgbicevqlcnhit.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdHRvd2NnYmljZXZxbGNuaGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTI4MzksImV4cCI6MjA5NTEyODgzOX0.FOsUdHvbEMyXpfylziM8koxnTzj23FcKunVVz_fZ-nc';

async function testUpdate() {
  const url = supabaseUrl + '/rest/v1/romanos_data?id=eq.1';
  const body = {
    updated_at: new Date().toISOString()
  };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  console.log('Status:', response.status);
  console.log('Response:', text);
}

testUpdate();
