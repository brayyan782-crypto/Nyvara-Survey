"use client";

import SurveyForm from '@/components/survey/SurveyForm';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-6 py-4">
          <h1 className="font-headline text-5xl text-primary">Diagnóstico Nyvara</h1>
        </header>

        <SurveyForm />
        
      </div>

      <footer className="text-center mt-8 text-sm text-muted-foreground">
        <p>© 2025 Nyvara. Ideas que flotan, marcas que permanecen.</p>
      </footer>
    </div>
  );
}
