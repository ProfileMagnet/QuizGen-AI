import React from 'react';
import './TeamSection.css';

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'VAMSHI MANTHRI',
      role: 'Full Stack Developer',
      description: 'Skilled Full Stack Developer with strong expertise in JavaScript, React, Node.js, focused on building scalable, responsive, and user-centered web applications that drive measurable business value. Experienced in clean architecture, efficient system design, and modern development practices, with a constant drive for innovation and excellence. Dedicated to creating seamless digital experiences through thoughtful design, optimized performance, and continuous learning.',
      linkedin: 'https://www.linkedin.com/in/vamshi-manthri/'
    },
    {
      name: 'MAHESH KETAM',
      role: 'AI Engineer',
      description: `AI Engineer specializing in  designing and developing intelligent, scalable, and high-impact AI systems that drive real-world innovation.
With deep expertise in machine learning, deep learning, and agentic AI , focuses on transforming complex ideas into practical, production-ready solutions.
 Work reflects a strong commitment to technical excellence, innovation, and building AI systems that think, reason, and act autonomously.`,
      linkedin: 'https://www.linkedin.com/in/mahesh-ketam/'
    }

  ];

  return (
    <section className="team-section" id="team">
      <div className="container">
        <div className="team-header">
          <h2 className="section-title">Our Team</h2>
          <p className="section-subtitle">
            Meet the experts behind QuizGen AI
          </p>
        </div>

        <div className="team-content">
          {teamMembers.map((member, index) => (
            <div className="team-member" key={index}>
              <div className="member-info">
                <h3>{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p>{member.description}</p>
                <div className="member-social">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="linkedin-link"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;