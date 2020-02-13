import React, { useState } from 'react';

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState('');
  handleSubmit = (e) => {
    e.preventDefault();
    setSelectedImage(e.target.files[0]);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" id="image" name="image" accept="image/*" />
    </form>
  )
}

export default ImageUpload;