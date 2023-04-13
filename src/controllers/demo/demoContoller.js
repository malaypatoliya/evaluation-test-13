const APIResponseFormat = require('../../utils/APIResponseFormat.js');
const DemoService = require('../../services/demo/demoServices.js');
const { _doDecrypt } = require('../../utils/encryption.js');

const EventEmitter = require('events');
const event = new EventEmitter();

event.on("Demofetch", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> All Demos are fetched");
});

event.on("DemoAdd", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo is added");
});

event.on("DemoUpdate", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo is updated");
});

event.on("DemoDelete", () => {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Demo is deleted");
});

const demo = async (req, res) => {
    try {
        const demo = await DemoService.demo();
        event.emit("Demofetch");
        return APIResponseFormat._ResDataFound(res, demo);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const addDemo = async (req, res) => {
    try {
        let { name, email, age } = req.body;
        // check all fields are required or not
        if (!name || !email || !age) {
            return APIResponseFormat._ResMissingRequiredField(res, "All fields are required");
        }

        // check email is valid or not
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email)) {
            return APIResponseFormat._ResMissingRequiredField(res, "Email is not valid");
        }

        // check email is exist or not
        const isEmailExist = await DemoService.isEmailExist(email);
        if (isEmailExist) {
            // check deleted_at is null or not
            if(isEmailExist.deleted_at === null){
                return APIResponseFormat._ResDataAlreadyExists(res, "Email is already exist");
            }else{
                // restore demo
                const demo = await DemoService.restoreDemo(isEmailExist.id);
                if (!demo) {
                    return APIResponseFormat._ResDataNotFound(res);
                }
                event.emit("DemoAdd");
                return APIResponseFormat._ResDataCreated(res);
            }
        }else{
            const demo = await DemoService.addDemo({
                name: name,
                email: email,
                age: age
            });
            if (!demo) {
                return APIResponseFormat._ResDataNotFound(res);
            }
            event.emit("DemoAdd");
            return APIResponseFormat._ResDataFound(res, demo);
        }
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const updateDemo = async (req, res) => {
    try {
        let { name, age } = req.body;
        let update_id = req.header("update_id");
        // check update_id is required or not
        if (!update_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "update_id is required");
        }
        update_id = _doDecrypt(update_id);

        // check demo is exist or not
        const isDemoExist = await DemoService.isDemoExist(update_id);
        if(!isDemoExist) {
            return APIResponseFormat._ResDataNotFound(res);
        }

        // check all fields are required or not
        if (!name || !age) {
            return APIResponseFormat._ResMissingRequiredField(res, "All fields are required");
        }

        // update demo
        const updatedDemo = await DemoService.updateDemo(update_id, { name: name, age: age });
        if (!updatedDemo) {
            return APIResponseFormat._ResDataNotFound(res);
        }
        event.emit("DemoUpdate");
        return APIResponseFormat._ResDataUpdated(res);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

const deleteDemo = async (req, res) => {
    try {
        let delete_id = req.header("delete_id");

        // check delete_id is required or not
        if (!delete_id) {
            return APIResponseFormat._ResMissingRequiredField(res, "delete_id is required");
        }
        delete_id = _doDecrypt(delete_id);

        // check demo is exist or not
        const isDemoExist = await DemoService.isDemoExist(delete_id);
        if(!isDemoExist) {
            return APIResponseFormat._ResDataNotFound(res);
        }

        // delete demo
        const deletedDemo = await DemoService.deleteDemo(delete_id);
        if (!deletedDemo) {
            return APIResponseFormat._ResDataNotFound(res);
        }
        event.emit("DemoDelete");
        return APIResponseFormat._ResDataDeleted(res);
    } catch (error) {
        return APIResponseFormat._ResServerError(res, error);
    }
}

module.exports = {
    demo,
    addDemo,
    updateDemo,
    deleteDemo,
}