import React from 'react';

const ResumeTemplate = React.forwardRef(({ data, theme }, ref) => {
  const isGlass = theme === 'glass';

  const Section = ({ title, children }) => (
    title && children ? (
      <div className="mt-5 px-8"> {/* Increased padding for safe margins */}
        <h2 className="text-md font-bold border-b border-gray-400 uppercase tracking-wide mb-2 text-blue-800">
          {title}
        </h2>
        <div className="text-gray-700 text-[13px] leading-snug">{children}</div>
      </div>
    ) : null
  );

  return (
    <div 
      ref={ref} 
      id="printable-resume" 
      className={`p-10 w-full max-w-[210mm] min-h-[297mm] mx-auto transition-all duration-500 font-sans shadow-none
      ${isGlass ? 'bg-white' : 'bg-white'}`}
      style={{ boxSizing: 'border-box' }}
    >
      
      {/* Header with balanced margins */}
      <div className="text-center border-b-2 border-gray-800 pb-3 mx-8">
        <h1 className="text-3xl font-black uppercase text-gray-900 leading-none">
          {data.fullName || "YOUR NAME"}
        </h1>
        {data.role && (
          <p className="text-sm text-indigo-700 font-bold mt-1 tracking-widest uppercase">
            {data.role} {data.isFresher ? "| FRESHER" : "| EXPERIENCED"}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 mt-2 text-[11px] text-gray-600 font-medium">
          {data.email && <span>Email: {data.email}</span>}
          {data.phone && <span>Mob: {data.phone}</span>}
          {data.location && <span>Loc: {data.location}</span>}
        </div>
        
        <div className="flex flex-col items-center gap-1 mt-2 text-[10px] text-blue-600 font-medium">
          {data.linkedin && (
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-700">LinkedIn:</span>
              <a href={data.linkedin} target="_blank" rel="noreferrer" className="underline">{data.linkedin}</a>
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1">
              <span className="font-bold text-gray-700">GitHub:</span>
              <a href={data.github} target="_blank" rel="noreferrer" className="underline">{data.github}</a>
            </div>
          )}
        </div>
      </div>

      <Section title="Professional Summary">
        <p className="text-justify italic">"{data.objective || 'Goal-oriented professional looking to contribute to company growth.'}"</p>
      </Section>

      <Section title="Education">
        {data.educationList?.map((edu, index) => (
          <div key={index} className="mb-2 flex justify-between items-start">
            <div>
              <p className="font-bold text-gray-900 uppercase">{edu.course || "Degree Name"}</p>
              <p className="text-xs text-gray-600 italic">{edu.institute || "University/College"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-800">{edu.year || "Year"}</p>
              <p className="text-xs text-blue-700 font-black">
                {edu.scoreType}: {edu.score || "0.0"}
              </p>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Technical Skills">
        <p className="font-medium text-gray-800 tracking-tight">{data.skills}</p>
      </Section>

      {!data.isFresher && (
        <Section title="Work Experience">
          <p className="whitespace-pre-line text-[12px]">{data.experienceDetails}</p>
        </Section>
      )}

      <Section title="Key Projects">
        <p className="whitespace-pre-line text-[12px] font-medium">{data.projects}</p>
      </Section>

      <Section title="Achievements & Certifications">
        <p className="whitespace-pre-line text-[12px]">{data.achievements}</p>
      </Section>

      <Section title="Declaration">
        <p className="text-[12px] text-gray-700 leading-relaxed italic">
          {data.declaration || "I hereby declare that the information provided above is true to the best of my knowledge and belief."}
        </p>
        <div className="mt-10 flex justify-between items-end">
           <div className="text-[11px] text-gray-600 space-y-4">
              <p className="border-b border-gray-300 w-32 pb-1">Place: </p>
              <p className="border-b border-gray-300 w-32 pb-1">Date: </p>
           </div>
           <div className="text-center border-t border-gray-400 pt-1 px-6">
              <p className="text-[11px] font-bold text-gray-900">({data.fullName || "Signature"})</p>
           </div>
        </div>
      </Section>
    </div>
  );
});

export default ResumeTemplate;