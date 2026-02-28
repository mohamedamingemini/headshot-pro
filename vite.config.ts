
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Manually read .env to override system environment variables if needed
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const fileContent = fs.readFileSync(envPath, 'utf-8');
      const lines = fileContent.split('\n');
      for (const line of lines) {
        const [key, ...valueParts] = line.split('=');
        if (key && key.trim() === 'GEMINI_API_KEY') {
          const value = valueParts.join('=').trim();
          if (value) {
            env.GEMINI_API_KEY = value;
            console.log('Overriding GEMINI_API_KEY from .env file:', value.substring(0, 5) + '...');
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to read .env file manually:', error);
  }

  console.log('Final GEMINI_API_KEY in Vite config:', env.GEMINI_API_KEY ? env.GEMINI_API_KEY.substring(0, 5) + '...' : 'undefined');

  return {
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify("AIzaSyBUkw46ldA6gxsVyfF6F9f1ATLi1D8B3ZE"),
      'process.env.MY_NEW_API_KEY': JSON.stringify("AIzaSyBUkw46ldA6gxsVyfF6F9f1ATLi1D8B3ZE"),
    },
    build: {
      outDir: 'dist',
    }
  };
});
