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

async function createDatabase() {
  try {
    console.log('🚀 Creating database tables...')
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-tables.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📖 Reading SQL file...')
    
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      if (statement.trim() !== ';') {
        try {
          console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
          
          // Execute using the REST API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ sql: statement })
          })
          
          if (response.ok) {
            successCount++
          } else {
            const errorText = await response.text()
            console.warn(`⚠️  Warning on statement ${i + 1}: ${response.status} - ${errorText}`)
            errorCount++
          }
          
        } catch (error) {
          console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message)
          errorCount++
        }
      }
    }
    
    console.log(`\n📊 Results:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`⚠️  Warnings: ${errorCount}`)
    
    if (errorCount === 0) {
      console.log('🎉 All database tables created successfully!')
    } else {
      console.log('ℹ️  Some statements had warnings, but this is often normal')
    }
    
    // Test the tables
    await testTables()
    
  } catch (error) {
    console.error('❌ Database creation failed:', error)
    console.log('\n📋 Alternative: Copy the SQL from scripts/create-tables.sql and run it manually in Supabase dashboard')
    process.exit(1)
  }
}

async function testTables() {
  try {
    console.log('\n🧪 Testing created tables...')
    
    const tables = ['users', 'projects', 'tasks', 'notifications']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: Table exists and accessible`)
        }
      } catch (error) {
        console.log(`❌ ${table}: ${error.message}`)
      }
    }
    
    console.log('\n🎉 Database setup completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Test the application at http://localhost:3000')
    console.log('2. Create a user account to test functionality')
    console.log('3. Verify data is being stored in Supabase')
    
  } catch (error) {
    console.error('❌ Table testing failed:', error)
  }
}

// Run the database creation
createDatabase()
