import React, { useState } from 'react';
import './ContactUs.css';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        alert("Thank you for your message! We will get back to you as soon as possible.");
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <form  className='Contactus-form'onSubmit={handleSubmit}>
            <div className='ContactUs-text'>
                Name
            </div>
            <input className='registerInputbox'
                type="text" 
                name="name" 
                value={formData.name}
                onChange={handleChange}>
            </input>

            <div className='ContactUs-text'>
                Email
            </div>
            <input className='registerInputbox'
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}>
            </input>
            <div className='ContactUs-text'>
                Message
            </div>
            <input className='registerInputbox'
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}>
            </input>

            <button className='Contact-us-button'type="submit">Send</button>
        </form>
    );
}

export default ContactForm;