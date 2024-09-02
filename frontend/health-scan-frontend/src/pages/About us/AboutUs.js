import React from 'react';
import './AboutUs.css';

const teamMembers = [
    {
        name: 'Cosmin-Ionut Radu',
        title: 'Data Scientist',
        image: '/path/to/cosmin-image.jpg',  // Update with the correct path
        description: 'bla bla',
    },
    {
        name: 'Stefan Ichim',
        title: 'Data Scientist',
        image: '/path/to/stefan-image.jpg',  // Update with the correct path
        description: 'bla bla',
    },
];

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <h1 className="title">Meet the Team</h1>
            <p className="subtitle">Our dedicated professionals are committed to providing accurate diagnoses to empower your healthcare journey.</p>
            <div className="team-container">
                {teamMembers.map((member, index) => (
                    <div className="team-card" key={index}>
                        <img src={member.image} alt={member.name} className="team-image" />
                        <h3 className="team-name">{member.name}</h3>
                        <h4 className="team-title">{member.title}</h4>
                        <p className="team-description">{member.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
