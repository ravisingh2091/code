import { validateProject, validateRoom, validateWindow } from './_requestValidators';
import { sendResponse } from '../../utils/sendResponse';
import { Project, Room, Window, PricingEngine } from "../../models";

export const addProject = async (req, res, next) => {
    try {
        const errors = validateProject(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body
        body.userId = req.user._id
        let project = await (new Project(body).save())
        sendResponse(
            res,
            200,
            project,
            "Project is created."
        )
    } catch (error) {
        next(error)
    }
}

export const projectDoneStatus = async (req, res, next) => {
    try {
        let project = Project.findOne({ _id: req.params.projectId })
        let totalRooms = project.bedRooms +
            project.bathRooms +
            project.masterBedRooms +
            project.masterBaths +
            project.livingRooms +
            project.diningRooms +
            project.kitchens +
            project.offices +
            project.garages +
            project.other

        let roomsDoneCount = Room.find({ projectId: project._id, doneStatus: true }).count()

        if (totalRooms > roomsDoneCount) {
            return sendResponse(res, 400, {}, "Opps! Please make sure you have done with all the rooms");
        }
        sendResponse(res, 200, {}, "Project mark as done")

    } catch (error) {
        next(error)
    }
}

export const addRoom = async (req, res, next) => {
    try {
        const errors = validateRoom(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body

        let room = await (new Room({
            name: body.name,
            window: body.windowCount,
            userId: req.user._id,
            projectId: req.user._id,
        }).save())

        sendResponse(
            res,
            200,
            room,
            "Rooms is added."
        )

    } catch (error) {
        next(error)
    }
}

export const roomDoneStatus = async (req, res, next) => {
    try {
        let room = Room.findOne({ _id: req.params.roomId })
        let totalWondow = room.window

        let wondowDoneCount = Room.find({ roomId: room._id }).count()

        if (totalWondow > wondowDoneCount) {
            return sendResponse(res, 400, {}, "Opps! Please make sure you have done with all the window");
        }
        sendResponse(res, 200, {}, "Room mark as done")

    } catch (error) {
        next(error)
    }
}

export const addWindow = async (req, res, next) => {
    try {
        const errors = validateWindow(req);
        if (errors) {
            return sendResponse(res, 400, {}, errors[0].msg);
        }
        let body = req.body

        //get pricing data
        let pricingEngine = await PricingEngine.findOne({})
        //get total area by adding width and height 
        let firstKey = +body.width + +body.height <= 100 ? '100' : '101'
        let lastKey = body.shape == 'specialShape' ? 's' : ''

        let price = pricingEngine.opningSize[firstKey + lastKey]
        let estimitatedPrice = price

        for (let feature of body.features) {
            estimitatedPrice += (pricingEngine.features[feature] * price) / 100
        }
        if (body.shape != 'specialShape') {
            estimitatedPrice += (pricingEngine.windowType[body.shape] * price) / 100
        }
        body.estimitatedPrice = estimitatedPrice

        await (new Window(body).save())

        sendResponse(
            res,
            200,
            {},
            "Window is added."
        )


    } catch (error) {
        next(error)
    }
}

export const roomDetail = async (req, res, next) => {
    try {
        let window = await Window.findOne({ roomId: req.params.roomId })
        sendResponse(
            res,
            200,
            window,
            "Room details."
        )

    } catch (error) {
        next(error)
    }
}

export const roomList = async (req, res, next) => {
    try {

        let room = await Room.find({
            projectId: req.params.projectId,
        })

        sendResponse(
            res,
            200,
            room,
            "Room list."
        )

    } catch (error) {
        next(error)
    }
}
