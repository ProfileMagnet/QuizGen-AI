import React from 'react';
import './TeamSection.css';

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Chief Executive Officer",
      bio: "Former VP of Product at EdTech Innovations with 15+ years in educational technology.",
      avatar: "AJ",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Maria Garcia",
      role: "Chief Technology Officer",
      bio: "AI researcher with PhD in Machine Learning, previously at Google AI and Microsoft Research.",
      avatar: "MG",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "David Chen",
      role: "Lead AI Engineer",
      bio: "Specializes in Natural Language Processing and educational data analytics.",
      avatar: "DC",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Sarah Williams",
      role: "UX/UI Designer",
      bio: "Award-winning designer focused on creating intuitive educational experiences.",
      avatar: "SW",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  const advisors = [
    {
      name: "Dr. Robert Thompson",
      role: "Education Technology Advisor",
      bio: "Professor of Educational Technology at Stanford University, 20+ years research experience.",
      avatar: "RT"
    },
    {
      name: "Jennifer Park",
      role: "Product Strategy Advisor",
      bio: "Former Head of Product at Khan Academy, expert in learning platform design.",
      avatar: "JP"
    }
  ];

  return (
    <section className="team-section" id="team">
      <div className="container">
        <div className="team-header">
          <h2 className="section-title">Our Team</h2>
          <p className="section-subtitle">
            Meet the passionate experts behind QuizGen AI
          </p>
        </div>
        
        <div className="team-content">
          <div className="team-members">
            <h3>Core Team</h3>
            <div className="members-grid">
              {teamMembers.map((member, index) => (
                <div className="team-member-card" key={index}>
                  <div className="member-avatar">
                    <div className="avatar-placeholder">{member.avatar}</div>
                  </div>
                  <div className="member-info">
                    <h4>{member.name}</h4>
                    <p className="member-role">{member.role}</p>
                    <p className="member-bio">{member.bio}</p>
                    <div className="social-links">
                      <a href={member.social.linkedin} className="social-link">LinkedIn</a>
                      <a href={member.social.twitter} className="social-link">Twitter</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="advisors">
            <h3>Advisors</h3>
            <div className="advisors-grid">
              {advisors.map((advisor, index) => (
                <div className="advisor-card" key={index}>
                  <div className="advisor-avatar">
                    <div className="avatar-placeholder">{advisor.avatar}</div>
                  </div>
                  <div className="advisor-info">
                    <h4>{advisor.name}</h4>
                    <p className="advisor-role">{advisor.role}</p>
                    <p className="advisor-bio">{advisor.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="acknowledgments">
            <h3>Acknowledgments</h3>
            <div className="acknowledgments-content">
              <p>We extend our gratitude to the open-source community and educational researchers whose work has inspired and informed our development:</p>
              <ul>
                <li>OpenAI GPT models for advancing natural language understanding</li>
                <li>Hugging Face transformers library for NLP tools and models</li>
                <li>Stanford Question Answering Dataset (SQuAD) for training data</li>
                <li>MIT OpenCourseWare for educational content examples</li>
                <li>Teachers and educators who provided feedback during our beta testing phase</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;