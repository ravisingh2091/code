import mongoose from '../db';

const PricingEngine = new mongoose.Schema({
    opningSize: {
        "100": { type: Number, required: true },
        "101": { type: Number, required: true },
        "100s": { type: Number, required: true },
        "101s": { type: Number, required: true }
    },
    windowType: {
        "singleHung": { type: Number, required: true },
        "doubleHung": { type: Number, required: true },
        "sliding": { type: Number, required: true },
        "picture": { type: Number, required: true },
        "awning": { type: Number, required: true },
        "bay": { type: Number, required: true },
        "casement": { type: Number, required: true }
    },
    features: {
        "tempered": { type: Number, required: true },
        "obscure": { type: Number, required: true },
        "colorExterior": { type: Number, required: true },
        "colorInterior": { type: Number, required: true },
        "woodgrainInterior": { type: Number, required: true },
        "doublePane": { type: Number, required: true },
        "triplePane": { type: Number, required: true },
        "laminated": { type: Number, required: true },
        "impactGlass": { type: Number, required: true },
        "grid": { type: Number, required: true },
        "fdlGrid": { type: Number, required: true },
    },
    material: {
        "vinyl": { type: Number, required: true },
        "wood": { type: Number, required: true },
        "historicallyCert": { type: Number, required: true },
        "fiberglass": { type: Number, required: true },
        "aluminum": { type: Number, required: true },
        "composite": { type: Number, required: true },
    }
}, { timestamp: true });

const PricingEngineModel = mongoose.model('PricingEngines', PricingEngine);
module.exports = PricingEngineModel


PricingEngineModel.findOne({}, (error, success) => {
    if (error) {
        console.log(error)
    } else {
        if (!success) {
            new PricingEngineModel({
                opningSize: {
                    "100": 0,
                    "101": 0,
                    "100s": 0,
                    "101s": 0
                },
                windowType: {
                    "singleHung": 0,
                    "doubleHung": 0,
                    "sliding": 0,
                    "picture": 0,
                    "awning": 0,
                    "bay": 0,
                    "casement": 0
                },
                features: {
                    "tempered": 0,
                    "obscure": 0,
                    "colorExterior": 0,
                    "colorInterior": 0,
                    "woodgrainInterior": 0,
                    "doublePane": 0,
                    "triplePane": 0,
                    "laminated": 0,
                    "impactGlass": 0,
                    "grid": 0,
                    "fdlGrid": 0,
                },
                material: {
                    "vinyl": 0,
                    "wood": 0,
                    "historicallyCert": 0,
                    "fiberglass": 0,
                    "aluminum": 0,
                    "composite": 0,
                }
            }).save((error, success) => {
                if (error) {
                    console.log("Error in creating PriceEngine");
                }
                else {
                    console.log("Pricing Engine created successfully");
                }
            })
        }
    }
})