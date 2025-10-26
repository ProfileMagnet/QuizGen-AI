import React, { useState } from 'react';
import './ContactSection.css';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    recipient: ''
  });

  const contactMethods = [
    {
      title: 'Vamshi Manthri',
      role: 'Full Stack Developer',
      email: 'manthrivamshi1@gmail.com',
      description: 'For development inquiries and technical discussions'
    },
    {
      title: 'Mahesh Ketam',
      role: 'AI Engineer',
      email: 'nirikshan987654321@gmail.com',
      description: 'For AI/ML related questions and technical support'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Find the selected team member's email
    const selectedMember = contactMethods.find(member => member.title === formData.recipient);

    if (!selectedMember) {
      alert('Please select a team member to send your message to.');
      return;
    }

    // Create mailto link with form data
    const subject = encodeURIComponent(`QuizGen Contact: ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Message:\n${formData.message}`
    );

    const mailtoLink = `mailto:${selectedMember.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      recipient: ''
    });

    alert('Thank you for your message! Your email client should open with the message ready to send.');
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-methods">
            <h3>Our Team</h3>
            <div className="methods-grid">
              {contactMethods.map((method, index) => (
                <div className="method-card" key={index}>
                  <h4>{method.title}</h4>
                  <div className="method-role">{method.role}</div>
                  <p>{method.description}</p>
                  <button
                    onClick={() => window.location.href = `mailto:${method.email}`}
                    className="contact-button"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Contact {method.title.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <select
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Team Member</option>
                  {contactMethods.map((member, index) => (
                    <option key={index} value={member.title}>
                      {member.title} - {member.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;