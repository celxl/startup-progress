exports.startupEnums = {
    status: {
        IDEA: 'Initial Idea',
        FOUNDATION: 'Foundation',
        DISCOVERY: 'Discovery',
        DELIVERED: 'Delivered',
        LIST: ['Initial Idea', 'Foundation', 'Discovery', 'Delivered']
    }
};

exports.taskEnums = {
    type: {
        VIRTUAL_OFFICE: 'virtual-office',
        MISSION_VISION: 'mission-&-vision',
        NAMING: 'name',
        DOMAIN: 'domain',
        ROADMAP: 'road-map',
        COMP_ANALYSIS: 'competitor-analysis',
        MARKETING_WEB: 'marketing-web-site',
        MVP: 'mvp',
        LIST: [
            'virtual-office',
            'mission-&-vision',
            'name',
            'domain',
            'road-map',
            'competitor-analysis',
            'marketing-web-site',
            'mvp'
        ]
    },
    status:{
        COMPLETE: 'Completed',
        INCOMPLETE: 'InCompleted',
        LIST:['Completed', 'InCompleted']
    }
};

exports.stageEnums = {
    type:{
        FOUNDATION: 'Foundation',
        DISCOVERY: 'Discovery',
        DELIVERY: 'Delivery',
        LIST: ['Foundation', 'Discovery', 'Delivery']
    }
}