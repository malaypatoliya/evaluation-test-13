const db = require("../../db/models/index");
const Demo = db.demo;
const Op = db.Sequelize.Op;

const demo = async (req, res) => {
    try {
        const demo = await Demo.findAll();
        return demo
    } catch (error) {
        throw error;
    }
}

const isDemoExist = async (id) => {
    try {
        const demo = await Demo.findOne({
            where: {
                id: id
            }
        });
        return demo
    } catch (error) {
        throw error;
    }
}

const addDemo = async (demo) => {
    try {
        const newDemo = await Demo.create(demo);
        return newDemo
    } catch (error) {
        throw error;
    }
}

const updateDemo = async (id, demo) => {
    try {
        const updatedDemo = await Demo.update(demo, {
            where: {
                id: id
            }
        });
        return updatedDemo
    } catch (error) {
        throw error;
    }
}

const deleteDemo = async (id) => {
    try {
        const deletedDemo = await Demo.destroy({
            where: {
                id: id
            }
        });
        return deletedDemo
    } catch (error) {
        throw error;
    }
}

const isEmailExist = async (email) => {
    try {
        const demo = await Demo.findOne({
            where: {
                email: email
            },
            paranoid: false
        });
        return demo
    } catch (error) {
        throw error;
    }
}

const restoreDemo = async (id) => {
    try {
        const restoreDemo = await Demo.restore({
            where: {
                id: id
            }
        });
        return restoreDemo
    } catch (error) {
        throw error;
    }
}

module.exports = {
    demo,
    isDemoExist,
    addDemo,
    updateDemo,
    deleteDemo,
    isEmailExist,
    restoreDemo
}