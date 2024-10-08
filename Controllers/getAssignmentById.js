const  Assignment  = require('../Models/Assignment');
const User = require('../Models/Users');  // Using the model file you've shared
// const sequelize = require('../Models/db');

exports.getAssignmentById = async (req, res) => {
    try {
        if (req.body && Object.keys(req.body).length > 0) {
            return res.status(400).json({ message: 'Request body is not allowed in GET request' });
        }
        const id  = req.params.id;
        const userId = req.user.id;
        console.log(id)
        const attributes = Assignment.rawAttributes;
        const fields = Object.keys(attributes);
        console.log(fields);

        const assg = await Assignment.findOne({where: { id }, 
        include: [{
                model: User,
                as: 'user', // This should match the alias in your associations
                attributes: ['id', 'first_name', 'last_name', 'email'] // Choose the user attributes you want to fetch
            }]
        })

        
        console.log(assg)
            
        // Check if assignment exists
        if (!assg) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        

        // Structure the response with assignment and user details
        const responseDetails = {
            status: 'success',
            message: 'Assignment fetched successfully',
            data: {
                id: assg.id,
                name: assg.name,
                points: assg.points,
                numOfAttempts: assg.num_of_attempts,
                deadline: assg.deadline,
                // assignmentCreated: assg.assignment_created,
                // assignmentUpdated: assg.assignment_updated,
                assignmentCreated: assg.assignment_created,
                assignmentUpdated: assg.assignment_updated,
                userId: assg.userId,
                // userId: assg.userId,
                // useremail: assg.user.email,
                // userFName: assg.user.first_name,
                // userLName: assg.user.last_name // This will have the associated user details
            }
        };
        console.log(responseDetails)

        // Return the structured response
        res.status(200).json(responseDetails);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
