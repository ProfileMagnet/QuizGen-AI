import React from 'react';
import './TeamSection.css';

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      description: 'Former Google AI researcher with 10+ years of experience in machine learning'
    },
    {
      name: 'Sarah Williams',
      role: 'CTO',
      description: 'Full-stack developer and cloud architecture specialist'
    },
    {
      name: 'Michael Chen',
      role: 'AI Research Lead',
      description: 'PhD in Computer Science, specializing in natural language processing'
    },
    {
      name: 'Emma Davis',
      role: 'UX Director',
      description: 'Award-winning designer focused on intuitive user experiences'
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;