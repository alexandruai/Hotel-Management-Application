const express = require("express");
const router = express.Router();
const User = require("../models/user")

router.post("/register", async(req, res) => {
  
    let {name , email , password, type} = req.body,
    hasAccess = false;

    if (!type) type = "client"

    if(type === "client") hasAccess = true;

    const newUser = new User({name , email , password, type, hasAccess})

    console.log("User nou ", newUser);

    try {
        newUser.save()
        res.send('User Registered successfully')
    } catch (error) {
         return res.status(400).json({ message: error });
    }

});


router.post("/login", async(req, res) => {

    const {email , password} = req.body

    try {
        
        const user = await User.find({email , password})

        if(user.length > 0)
        {
            const currentUser = {
                name : user[0].name , 
                email : user[0].email, 
                isAdmin : user[0].isAdmin,
                hasAccess: user[0].hasAccess,
                type: user[0].type,
                _id : user[0]._id
            }
            res.send(currentUser);
        }
        else{
            return res.status(400).json({ message: 'User Login Failed' });
        }

    } catch (error) {
           return res.status(400).json({ message: 'Something went weong' });
    }
  
});


router.get("/getallusers", async(req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.post("/deleteuser", async(req, res) => {
  
    const userid = req.body.userid

    try {
        await User.findOneAndDelete({_id : userid})
        res.send('User Deleted Successfully')
    } catch (error) {
        return res.status(400).json({ message: error });
    }

});

router.post("/revokeaccess", async (req, res) => {
    const { userId } = req.body;
  
    try {
      await User.findByIdAndUpdate(userId, { hasAccess: false });
      res.send('Access revoked successfully');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  });
  
  router.post("/allocateaccess", async (req, res) => {
    const { userId } = req.body;
  
    try {
      await User.findByIdAndUpdate(userId, { hasAccess: true });
      res.send('Access allocated successfully');
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  });

  // Manager adds a new employee
router.post("/addemployee", async(req, res) => {
    const { name, email, password, type } = req.body;

    if (!['angajat', 'receptioner'].includes(type)) {
        return res.status(400).json({ message: 'Invalid employee type' });
    }

    const newUser = new User({ name, email, password, type, hasAccess: false });

    try {
        await newUser.save();
        res.send('Employee added successfully, awaiting admin approval');
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Manager assigns tasks to employees
router.post("/assigntask", async (req, res) => {
    const { description, assignedTo, createdBy } = req.body;

    const newTask = new Task({ description, assignedTo, createdBy });

    try {
        await newTask.save();
        res.send('Task assigned successfully');
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Employee views tasks
router.get("/tasks", async (req, res) => {
    const { userId } = req.body;

    try {
        const tasks = await Task.find({ assignedTo: userId });
        res.send(tasks);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Change password
router.post("/changepassword", async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilizator nu a fost gasit' });
      }
      
      if (currentPassword !== user.password) {
        return res.status(400).json({ message: 'Parola curenta este incorecta!' });
      }
  
    user.password = newPassword;
  
      await user.save();
  
      res.send('Password changed successfully');
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  });

  router.post("/getuserbyusername", async (req, res) => {
    const { username } = req.body;
    try {
      const user = await User.findOne({ name: username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.send(user);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  });

module.exports = router