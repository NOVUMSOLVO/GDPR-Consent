// Using native fetch API (Node.js v18+)
async function testLogin() {
  try {
    console.log('Testing admin login endpoint...');
    const response = await fetch('http://localhost:3002/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'pharmacy123',
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin();
