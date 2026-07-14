import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually since dotenv might not be installed
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#\s=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log('Testing connection to URL:', supabaseUrl);
console.log('Using Anon Key starting with:', supabaseKey?.substring(0, 15) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('\n--- 1. Testing connection_test table ---');
  try {
    const { data, error } = await supabase.from('connection_test').select('*');
    if (error) {
      console.error('connection_test select failed ❌:', error);
    } else {
      console.log('connection_test select success ✅:', data);
    }
  } catch (err) {
    console.error('connection_test exception ❌:', err);
  }

  console.log('\n--- 2. Testing tasks table select ---');
  try {
    const { data, error } = await supabase.from('tasks').select('*').limit(5);
    if (error) {
      console.error('tasks select failed ❌:', error);
    } else {
      console.log('tasks select success ✅:', data);
    }
  } catch (err) {
    console.error('tasks exception ❌:', err);
  }

  console.log('\n--- 3. Testing tasks table insert ---');
  try {
    const testTask = {
      id: 'test_task_' + Date.now(),
      user_id: 'test_user_diagnostic',
      title: 'Diagnostic Test Task',
      due_date: '2026-07-14',
      due_time: '12:00',
      priority: 'high',
      status: 'todo',
      notes: 'Inserted by diagnostic script',
      subtasks: [],
      attachments: []
    };
    const { data, error } = await supabase.from('tasks').insert(testTask).select();
    if (error) {
      console.error('tasks insert failed ❌:', error);
    } else {
      console.log('tasks insert success ✅:', data);
      
      // Clean it up
      const { error: delError } = await supabase.from('tasks').delete().eq('id', testTask.id);
      if (delError) console.error('Cleanup failed:', delError);
      else console.log('Cleanup successful ✅');
    }
  } catch (err) {
    console.error('tasks insert exception ❌:', err);
  }
}

runTest();
