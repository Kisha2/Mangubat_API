const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mongo-test')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  description: { type: String, required: true },
  units: { type: Number, required: true },
  specialization: { type: String, required: true }, 
  tags: { type: [String], required: true }
});

const Course = mongoose.model('Course', courseSchema);

// Get Backend Courses
app.get('/api/courses/backend', async (req, res) => {
  try {
    const backendCourses = await Course.find({
      tags: { $regex: /backend/ }
    }).sort({ description: 1 });

    if (backendCourses.length === 0) {
      return res.status(404).send('No backend courses were found.');
    }

    res.send(backendCourses);
  } catch (error) {
    console.error('There was a problem fetching backend courses.', error);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve Course By Name
app.get('/api/courses/byName', async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).send('The "name" query parameter must be provided.');
    }
    
    const query = { description: { $regex: name, $options: 'i' } };
    
    const course = await Course.findOne(query);
    
    if (!course) {
      return res.status(404).send('The provided name does not match any existing courses.');
    }

    res.send(course);
  } catch (error) {
    console.error('Error retrieving course by name', error);
    res.status(500).send('Internal Server Error');
  }
});


// Retrieve Courses by Specialization
app.get('/api/courses/specializ', async (req, res) => {
  try {
    const { specialization } = req.query;
    
    if (!specialization) {
      return res.status(400).send('Specialization parameter is required.');
    }
    
    const query = { specialization: { $regex: specialization, $options: 'i' } };
    
    const courses = await Course.find(query);
    
    if (courses.length === 0) {
      return res.status(404).send('No courses were found matching the given specialization.');
    }

    res.send(courses);
  } catch (error) {
    console.error('Error retrieving courses by specialization.', error);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve All Published BSIS and BSIT Courses
app.get('/api/courses/bsis-bsit', async (req, res) => {
  try {
    const bsisCourses = await Course.find({ code: /^BSIS/ });
    const bsitCourses = await Course.find({ code: /^BSIT/ });
    res.send({ BSIS: bsisCourses, BSIT: bsitCourses });
  } catch (error) {
    console.error('Error retrieving BSIS and BSIT courses.', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get All Courses
app.get('/api/courses/allCourses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ description: 1 });
    res.send(courses);
  } catch (error) {
    console.error('Error retrieving courses', error);
    res.status(500).send('Internal Server Error');
  }
});

// Get Course by ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('Course not found');
    res.send(course);
  } catch (error) {
    console.error('Error retrieving course', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Course by ID
app.put('/api/courses/:id', async (req, res) => {
  try {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!course) return res.status(404).send('Course not found');

    res.send(course);
  } catch (error) {
    console.error('Error updating course', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete Course by ID
app.delete('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id);
    if (!course) return res.status(404).send('Course were not found');
    res.send(course);
  } catch (error) {
    console.error('Error deleting course', error);
    res.status(500).send('Internal Server Error');
  }
});


function validateCourse(course) {
  const schema = Joi.object({
    code: Joi.string().required(),
    description: Joi.string().required(),
    units: Joi.number().required(),
    specialization: Joi.string().required(), 
    tags: Joi.array().items(Joi.string()).required()
  });
  return schema.validate(course);
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An error occured!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});

