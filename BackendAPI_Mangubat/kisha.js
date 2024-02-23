const express = require("express");
const mongoose = require("mongoose");
const Course = require("./model/kishaModel");

const api = express();
const PORT = 3010;

api.get("/", (req, res) => {
    res.send("WELCOME YOU ARE IN KISHA MANGUBAT API!!!");
});

mongoose
  .connect("mongodb://localhost:27017/mongo")
  .then(() => {
    console.log("Database Connected!");
    
    // Start the server
    api.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}...`);
    });
  })
  .catch((error) => {
    console.log(error);
  });


//Retrieving of all published backend courses and sorting of names alphabetically.
api.get("/api/courses/sortedByName", async (req, res) => {
  try {
    const year = await Course.find();
    let courses = [];
    year.forEach((year) => {
      ["1st Year", "2nd Year", "3rd Year", "4th Year"].forEach((yearKey) => {
        if (year[yearKey]) {
          courses.push(...year[yearKey]);
        }
      });
    });
    courses.sort((a, b) => a.description.localeCompare(b.description));
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});


//Selecting and extracting the name and specialization of each courses.
api.get("/api/courses/nameAndSpecialization", async (req, res) => {
    try {
      const year = await Course.find();
      let courses = [];
      year.forEach((year) => {
        ["1st Year", "2nd Year", "3rd Year", "4th Year"].forEach((yearKey) => {
          if (year[yearKey]) {
            courses.push(...year[yearKey]);
          }
        });
      });
      const descriptionsAndTags = courses.map((course) => ({
        description: course.description,
        tags: course.tags,
      }));
      res.json(descriptionsAndTags);
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  });

//Retrieving all published BSIS and BSIT courses from curriculum.
api.get("/api/courses/publishedCourses", async (req, res) => {
  try {
    const year = await Course.find();
    let courses = [];
    year.forEach((year) => {
      ["1st Year", "2nd Year", "3rd Year", "4th Year"].forEach((yearKey) => {
        if (year[yearKey]) {
          courses.push(...year[yearKey]);
        }
      });
    });
    const descriptionsAndTags = courses
      .filter(
        (course) => course.tags.includes("BSIT") || course.tags.includes("BSIS")
      )
      .map((course) => ({
        description: course.description,
        tags: course.tags,
      }));
    res.json(descriptionsAndTags);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});
