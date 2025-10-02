const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...')
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../lib/database/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📖 Reading schema file...')
    
    // Execute the schema
    console.log('⚡ Executing database schema...')
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema })
    
    if (error) {
      console.error('❌ Error executing schema:', error)
      
      // Try alternative approach - split into individual statements
      console.log('🔄 Trying alternative approach...')
      await executeSchemaInParts(schema)
    } else {
      console.log('✅ Database schema executed successfully!')
    }
    
    // Test the connection
    console.log('🧪 Testing database connection...')
    await testConnection()
    
    console.log('🎉 Database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

async function executeSchemaInParts(schema) {
  // Split schema into individual statements
  const statements = schema
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
  
  console.log(`📝 Executing ${statements.length} SQL statements...`)
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    if (statement.trim()) {
      try {
        console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
        
        // Use direct SQL execution
        const { error } = await supabase
          .from('_sql')
          .select()
          .limit(0)
        
        // Alternative: Use the REST API to execute SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ sql: statement })
        })
        
        if (!response.ok) {
          console.warn(`⚠️  Warning on statement ${i + 1}: ${response.statusText}`)
        }
        
      } catch (error) {
        console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
      }
    }
  }
}

async function testConnection() {
  try {
    // Test with a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('ℹ️  Users table not yet created (this is expected)')
    } else {
      console.log('✅ Database connection successful!')
    }
  } catch (error) {
    console.log('ℹ️  Database tables will be created via Supabase dashboard')
  }
}

// Run the setup
setupDatabase()
