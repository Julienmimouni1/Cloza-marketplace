import React from 'react';
import ReactMarkdown from 'react-markdown';
import { PolicyData } from '@/lib/markdown';

interface PolicyRendererProps {
  data: PolicyData;
}

export const PolicyRenderer: React.FC<PolicyRendererProps> = ({ data }) => {
  return (
    <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="mb-12 border-b border-slate-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          {data.title}
        </h1>
        {data.lastUpdated && (
          <p className="text-sm text-slate-500 font-sans uppercase tracking-widest">
            Dernière mise à jour : {data.lastUpdated}
          </p>
        )}
      </header>

      <div className="prose prose-slate prose-lg max-w-none 
        prose-headings:font-serif prose-headings:text-slate-900 
        prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h2:mt-12
        prose-strong:text-cloza-gold prose-strong:font-bold
        prose-p:text-slate-700 prose-p:leading-relaxed
        prose-li:text-slate-700
        font-sans">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </div>

    </article>
  );
};
