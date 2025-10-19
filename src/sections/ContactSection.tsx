import React, { useState } from 'react';
import './ContactSection.css';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };

  const contactMethods = [
    {
      title: "Email Support",
      description: "For general inquiries and support requests",
      detail: "support@quizgenai.com",
      icon: "✉️"
    },
    {
      title: "Technical Support",
      description: "For technical issues and bug reports",
      detail: "tech@quizgenai.com",
      icon: "💻"
    },
    {
      title: "Sales Inquiries",
      description: "For pricing and licensing information",
      detail: "sales@quizgenai.com",
      icon: "💰"
    },
    {
      title: "Community Forum",
      description: "Connect with other users and educators",
      detail: "community.quizgenai.com",
      icon: "👥"
    }
  ];

  const faqs = [
    {
      question: "How long does it take to generate a quiz?",
      answer: "Most quizzes are generated within 30 seconds to 2 minutes, depending on the length and complexity of your content."
    },
    {
      question: "What file formats can I export quizzes to?",
      answer: "We support exporting to PDF, Word documents, Google Forms, and various LMS formats like QTI and CSV."
    },
    {
      question: "Is my content stored on your servers?",
      answer: "No, your content is processed in real-time and not stored on our servers. We prioritize your privacy and data security."
    },
    {
      question: "Do you offer discounts for educational institutions?",
      answer: "Yes, we offer special pricing for schools, universities, and educational organizations. Contact our sales team for more information."
    }
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-header">
          <h2 className="section-title">Support & Contact</h2>
          <p className="section-subtitle">
            Get in touch with our team or find answers to common questions
          </p>
        </div>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Contact Methods</h3>
            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div className="contact-method" key={index}>
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-details">
                    <h4>{method.title}</h4>
                    <p className="method-description">{method.description}</p>
                    <p className="method-detail">{method.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="contact-address">
              <h3>Our Office</h3>
              <div className="address-details">
                <p>QuizGen AI Headquarters</p>
                <p>123 Innovation Drive</p>
                <p>San Francisco, CA 94103</p>
                <p>United States</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-section">
            <h3>Send Us a Message</h3>
            <form className="contact-form" onSubmit={handleSubmit}>
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
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="form-success">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="form-error">
                  Oops! Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div className="faq-item" key={index}>
                <h4 className="faq-question">{faq.question}</h4>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;