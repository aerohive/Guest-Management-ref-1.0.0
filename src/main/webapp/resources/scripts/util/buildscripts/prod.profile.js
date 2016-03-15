var profile = {
    resourceTags: {
        amd: function(filename, mid) {
            return true;
        }
    },
    basePath: "../../",
    releaseDir: "./ah-build",
    releaseName: "lib",
    action: "release",

    packages:[{
            name: "dojo",
            location: "dojo"
        },{
            name: "dijit",
            location: "dijit"
        },{
            name: "dojox",
            location: "dojox"
        },{
            name: "ah",
            location: "ah"
        },{
			name : "dgrid",
			location : "dgrid"
		},{
			name : 'dstore',
			location : 'dstore'
		},{
            name: "i18n",
            location: "../i18n"
        }],
    layers: {
        "dojo/dojo": {
            boot: true,
            customBase: true,
            include: [  "dojo/parser",
                        "dojo/ready",
                        "dojo/store/Memory",
                        "dojo/selector/acme",
                        "dojo/selector/lite",
                        "dojox/gfx/path",
                        "dojox/gfx/svg",
                        "dijit/layout/BorderContainer",
                        "dijit/layout/TabContainer",
                        "dijit/layout/ContentPane",
                        "ah/comp/common/UserHomePage",
                        "ah/comp/common/AHHeader",
                        "ah/comp/common/AHFooter"
                    ]
        },
        "ah/prod": {
            include: []
        }
    }
};
