import Branch from "../models/Branch.js";
import Course from "../models/Course.js";

export const createEntity = (Model) => async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const existingEntity = await Model.findOne({ email: req.body.email });
    if (existingEntity) {
      return res.status(400).json({ msg: `${Model.modelName} already exists` });
    }

    const newEntity = new Model({ ...req.body, createdBy: req.user.id });
    await newEntity.save();
    res.status(201).json({
      msg: `${Model.modelName} added successfully`,
      data: newEntity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getEntities = (Model) => async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const entities = await Model.find({ createdBy: req.user.id }).populate(
      "createdBy",
      ["username", "collegeName"]
    );
    res.status(200).json({ Data: entities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteEntity = (Model) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const entity = await Model.findById(id);
    if (!entity) {
      return res.status(404).json({ msg: `${Model.modelName} not found` });
    }

    if (entity.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: `Unauthorized to delete this ${Model.modelName}` });
    }

    await Model.findByIdAndDelete(id);
    res.status(200).json({ msg: `${Model.modelName} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateEntity = (Model) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const entity = await Model.findById(id);
    if (!entity) {
      return res.status(404).json({ msg: `${Model.modelName} not found` });
    }

    if (entity.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: `Unauthorized to update this ${Model.modelName}` });
    }

    Object.assign(entity, req.body);
    await entity.save();

    res
      .status(200)
      .json({ msg: `${Model.modelName} updated successfully`, entity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Branch
export const addBranch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const { branchName, course, seats, remaining_seats, filled_seats } =
      req.body;

    const existingBranch = await Branch.findOne({ branchName });
    if (existingBranch) {
      return res.status(400).json({ msg: "Branch already exists" });
    }

    const newBranch = new Branch({
      branchName,
      course,
      seats,
      remaining_seats,
      filled_seats,
      createdBy: req.user.id,
    });

    await newBranch.save();

    res
      .status(201)
      .json({ msg: "Branch added successfully", branch: newBranch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const showBranch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const branches = await Branch.find({ createdBy: req.user.id })
      .populate("createdBy", ["username", "collegeName"])
      .populate("course", "courseName");

    res.status(200).json({ branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    if (branch.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this branch" });
    }

    await Branch.findByIdAndDelete(id);
    res.status(200).json({ msg: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const editBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchName, course, seats, remaining_seats, filled_seats } =
      req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    if (branch.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to update this branch" });
    }

    if (branchName) branch.branchName = branchName;
    if (course) branch.course = course;
    if (seats) branch.seats = seats;
    if (remaining_seats) branch.remaining_seats = remaining_seats;
    if (filled_seats) branch.filled_seats = filled_seats;

    await branch.save();

    res.status(200).json({ msg: "Branch updated successfully", branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Course
export const addCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const { courseName } = req.body;

    const existingCourse = await Course.findOne({ courseName });
    if (existingCourse) {
      return res.status(400).json({ msg: "Course already exists" });
    }

    const newCourse = new Course({
      courseName,
      createdBy: req.user.id,
    });

    await newCourse.save();

    res
      .status(201)
      .json({ msg: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const showCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const courses = await Course.find({ createdBy: req.user.id }).populate(
      "createdBy",
      ["username", "collegeName"]
    );

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this course" });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ msg: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to update this course" });
    }

    if (courseName) course.courseName = courseName;

    await course.save();

    res.status(200).json({ msg: "Course updated successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};



// // Faculty Controller
// export const addFaculty = async (req, res) => {
//   try {
//     // Ensure user ID is extracted from token
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     const { userName, facultyName, email, mobileNo, password } = req.body;

//     // Check if faculty already exists
//     const existingFaculty = await Faculty.findOne({ email });
//     if (existingFaculty) {
//       return res.status(400).json({ msg: "Faculty already exists" });
//     }

//     // Create new Faculty
//     const newFaculty = new Faculty({
//       userName,
//       facultyName,
//       email,
//       mobileNo,
//       password,
//       createdBy: req.user.id, // Assigning createdBy from token
//     });

//     // Save to database
//     await newFaculty.save();

//     res
//       .status(201)
//       .json({ msg: "Faculty added successfully", faculty: newFaculty });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// export const showFaculty = async (req, res) => {
//   try {
//     // Ensure user ID is available from token
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     // Fetch all faculty members created by this user
//     const faculties = await Faculty.find({ createdBy: req.user.id }).populate(
//       "createdBy",
//       ["username", "collegeName"]
//     );

//     res.status(200).json({ faculties });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// export const deleteFaculty = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Ensure user ID is available from token
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     // Find faculty by ID
//     const faculty = await Faculty.findById(id);
//     if (!faculty) {
//       return res.status(404).json({ msg: "Faculty not found" });
//     }

//     // Check if the logged-in user is the creator
//     if (faculty.createdBy.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ msg: "Unauthorized to delete this faculty" });
//     }

//     // Delete faculty
//     await Faculty.findByIdAndDelete(id);
//     res.status(200).json({ msg: "Faculty deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// export const editFaculty = async (req, res) => {
//   try {
//     const { id } = req.params; // Get faculty ID from URL params
//     const { userName, facultyName, email, mobileNo } = req.body;

//     // Ensure user ID is available from token
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     // Find faculty by ID
//     const faculty = await Faculty.findById(id);
//     if (!faculty) {
//       return res.status(404).json({ msg: "Faculty not found" });
//     }

//     // Check if the logged-in user is the creator
//     if (faculty.createdBy.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ msg: "Unauthorized to update this faculty" });
//     }

//     // Update only the allowed fields
//     if (userName) faculty.userName = userName;
//     if (facultyName) faculty.facultyName = facultyName;
//     if (email) faculty.email = email;
//     if (mobileNo) faculty.mobileNo = mobileNo;

//     // Save updated faculty
//     await faculty.save();

//     res.status(200).json({ msg: "Faculty updated successfully", faculty });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // Counselor
// export const addCounselor = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     const { userName, counselorName, email, mobileNo, password } = req.body;

//     const existingCounselor = await Counselor.findOne({ email });
//     if (existingCounselor) {
//       return res.status(400).json({ msg: "Counselor already exists" });
//     }

//     const newCounselor = new Counselor({
//       userName,
//       counselorName,
//       email,
//       mobileNo,
//       password,
//       createdBy: req.user.id,
//     });

//     await newCounselor.save();
//     res
//       .status(201)
//       .json({ msg: "Counselor added successfully", counselor: newCounselor });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// export const showCounselor = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     const counselors = await Counselor.find({
//       createdBy: req.user.id,
//     }).populate("createdBy", ["username", "collegeName"]);
//     res.status(200).json({ counselors });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// export const deleteCounselor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     const counselor = await Counselor.findById(id);
//     if (!counselor) {
//       return res.status(404).json({ msg: "Counselor not found" });
//     }

//     if (counselor.createdBy.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ msg: "Unauthorized to delete this counselor" });
//     }

//     await Counselor.findByIdAndDelete(id);
//     res.status(200).json({ msg: "Counselor deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// export const editCounselor = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userName, counselorName, email, mobileNo } = req.body;

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ msg: "Unauthorized: No user ID found" });
//     }

//     const counselor = await Counselor.findById(id);
//     if (!counselor) {
//       return res.status(404).json({ msg: "Counselor not found" });
//     }

//     if (counselor.createdBy.toString() !== req.user.id) {
//       return res
//         .status(403)
//         .json({ msg: "Unauthorized to update this counselor" });
//     }

//     if (userName) counselor.userName = userName;
//     if (counselorName) counselor.counselorName = counselorName;
//     if (email) counselor.email = email;
//     if (mobileNo) counselor.mobileNo = mobileNo;

//     await counselor.save();
//     res.status(200).json({ msg: "Counselor updated successfully", counselor });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// };