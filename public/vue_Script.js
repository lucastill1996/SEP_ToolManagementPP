//form action
$(function() {
  
  // contact form animations
  $('#bt3').click(function() {
    $('#contactForm').fadeToggle();
  })
  $(document).mouseup(function (e) {
    var container = $("#contactForm");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.fadeOut();
    }
  });
  
});



//Handling row click
//Method to handle clicked row in vue
var handleRow = function (event, entry) {
    rowResultHolder = "CLICK ROW: " + JSON.stringify(entry);
    myVue.toolDetailFromRowClick = (entry);
    if (entry.hasOwnProperty("Name")) {
        myVue.middleTableToolLabel = entry.Name
    }   
    myVue.selectedToolArrayKeys = [];
    myVue.selectedToolArrayValues = [];
    Object.keys(entry).forEach(function (key) {          
            myVue.selectedToolArrayKeys.push(key);
            myVue.selectedToolArrayValues.push(entry[key]);
    });
    //after adding key/value decide if the clicked row is a tool or part
    //this is only possible since only tool.json has attribute "Id", case sensitive!
    if (myVue.selectedToolArrayKeys.indexOf("Id") > -1) {
        myVue.selectedRowIsTool = true;
    };
    if (myVue.selectedToolArrayKeys.indexOf("Id") == -1) {
        myVue.selectedRowIsTool = false;
    }

    myVue.toolDetailFromRowClicked = true;
    myVue.leftScreenSize = "col-sm-6";
    myVue.rightScreenShow = true;
    myVue.selectedTool_IncludedPartsValue_OldSearchTracker = myVue.selectedTool_IncludedPartsValue;
};

//Vue components
var myVue = new Vue({
    el: '#app',
    components: {
        VueBootstrapTable: VueBootstrapTable
    },
    data: {
        //misc variable to bind the class for 2 side of the screen, used to assign space
        leftScreenSize: "col-sm-12",
        rightScreenSize: "col-sm-6",
        rightScreenShow: false,

        SelectMachine: 'all',
        //Arrays for machine, tools, parts
        machineJSON: [],
        toolsJSON: [],
        partsJSON: [],
        //Array consist of filtered result from the combo box
        rawFilter: [],
        //Array to keep track of which machine was selected by comboBox
        listofSelectedMachines: [],
        //Array consist of the filtered result from BOTH comboBox and searchBar
        final_result_array: [],
        //Variable used for vue-bootstrap-table
        showFilter: true,
        showPicker: true,
        paginated: true,
        multiColumnSortable: true,
        filterCaseSensitive: false,
        handleRowFunction: handleRow,
        //tables Information
        toolColumns: [
            {
                title: "Tool Name",
                name: "Name",
                visible: true,
                editable: false,
            },
            {
                title: "Type",
                name: "Type",
                visible: true,
                editable: false,
            },
            {
                title: "Station Number",
                name: "StationNumber",
                visible: true,
                editable: false,
            },
            {
                title: "Owning Machine Serial",
                name: "MachineSerial",
                visible: true,
                editable: false,
            }
        ],
        toolValues: [],


        partColumns: [
            {
                title: "Identifier",
                name: "Identifier",
                visible: true,
                editable: false,
            },
            {
                title: "Type",
                name: "Type",
                visible: true,
                editable: false,
            },
            {
                title: "Hitcount",
                name: "Hitcount",
                visible: true,
                editable: false,
            },
            {
                title: "Owning tool ID",
                name: "ToolId",
                visible: true,
                editable: false,
            }
        ],
        partValues: [],


        toolDetailFromRowClicked: false,// used to hide the detail screen until the user click on a tool
        toolDetailFromRowClick: "",//recieving an object from the table which the user click
        selectedToolArrayKeys: [],//Used to store keys from toolsJSON
        selectedToolArrayValues: [],//Used to store valye from toolsJSON
        selectedTool_IncludedPartsValue: [],//storing value for selected tool's part
        selectedTool_IncludedPartsValue_OldSearchTracker:[],//storing value for previously selected toool's part
        selectedRowIsTool: false,
        clearMiddleTableNow: false,
        detailPageOn: true,
        middleTableToolLabel:"",
        //Variable used to generate dynamic columns
        allToolKeys: ["Name", "Type", "StationNumber", "MachineSerial"],//Used to hold information of which tool column was added
        addPartKeys: ["Identifier", "Type", "Hitcount", "ToolId"],//Used to hold information of which part column was added
    },
    //calling the method which load the json file at the loading of he page
    created: function () {
        this.fetchData();
    },
    //calling the json
    ready: function () {
    },
    methods: {
        fetchData: function () {
            var jsonURL1 = "public/Json/machine.json"; //consist of machine information, and the list of ID of tools in those machines
            var jsonURL2 = "public/Json/tools.json";//consist of tools information and a list of part IDs
            var jsonURL3 = "public/Json/parts.json";//consist of part information
            var self = this;
            //json1 for machineJSON
            axios.get(jsonURL1)
                .then(function (response) {
                    self.machineJSON = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
            //json2 for toolsJSON
            axios.get(jsonURL2)
                .then(function (response) {
                    self.toolsJSON = response.data;
                    self.getToolHeaders();
                })
                .catch(function (error) {
                    console.log(error);
                });
            //json3 for partJSON
            axios.get(jsonURL3)
                .then(function (response) {
                    self.partsJSON = response.data;
                    self.reformatPartJSON();
                    self.getPartHeaders();
                })
                .catch(function (error) {
                    console.log(error);
                });

        },
        //get and generate all possible headers for tool and part table
        getToolHeaders: function () {
            var self = this;
            for (var i = 0, u = self.toolsJSON.length; i < u; i++) {
                Object.keys(self.toolsJSON[i]).forEach(function (key) {
                    if (self.allToolKeys.indexOf(key) == -1) {
                        self.allToolKeys.push(key)
                        self.toolColumns.push(
                            {
                                title: key,
                                name: key,
                                visible: false,
                                editable: false,
                            }
                        );
                    }
                });
            }
        },
        getPartHeaders: function () {
            var self = this;
            for (var i = 0, u = self.partsJSON.length; i < u; i++) {
                Object.keys(self.partsJSON[i]).forEach(function (key) {
                    if (self.addPartKeys.indexOf(key) == -1) {
                        self.addPartKeys.push(key)
                        self.partColumns.push(
                            {
                                title: key,
                                name: key,
                                visible: false,
                                editable: false,
                            }
                        );
                    }
                });
            }

        },
        reformatPartJSON: function () {
            //loop through the raw partJSON
            //console.log(this.partsJSON[0].Attributes)
            for (var i = 0, u = this.partsJSON.length; i < u; i++) {
                //for each object, loops through them
                var self = this;
                var attributesCounter = this.partsJSON[i].Attributes.length;
                //Then copy the attribute inside "Attribute" to the partsJSON
                for (var x = 0, y = attributesCounter; x < y; x++) {
                    var key = self.partsJSON[i].Attributes[x].Key
                    var value = self.partsJSON[i].Attributes[x].Value;
                    self.partsJSON[i][self.partsJSON[i].Attributes[x].Key] = self.partsJSON[i].Attributes[x].Value;
                }
                //Remove "Attributes" since it is no longer need
                delete self.partsJSON[i].Attributes;
            }
        },
        clearMiddleTable: function () {
            this.clearMiddleTableNow = true;
            this.detailPageOn = true;
            this.selectedToolArrayKeys = [];
            this.selectedToolArrayValues = [];
            this.leftScreenSize = "col-sm-6";
            this.selectedRowIsTool=false;
            this.toolDetailFromRowClick = [];
        },
        turnBackMiddleTable: function () {
            this.detailPageOn = true;
            this.clearMiddleTableNow = false;
            this.leftScreenSize = "col-sm-6";
           
        },
        clearAllDetailPage: function () {
            this.detailPageOn = false;
            this.leftScreenSize = "col-sm-12";
        }
    },
    computed: {
        //Getting unique machine names for combobox
        uniqueMachines: function () {
            var self = this;
            var mules = [];
            var result = [];
            for (var i = 0; i < self.machineJSON.length; i++) {
                mules.push({
                    mName: self.machineJSON[i].Name
                });
            }
            mules = _.sortBy(mules, 'mName')
            result = _.uniq(_.map(mules, 'mName'));
            return result;
        },
        //This can be combined with the method follow, since vue-bootstrap-table already have built in table search
        tools_filtered_by_searchAndBox: function () {
            //rawResult_array recieve objects from filteredMachine, 
            //and will get filtered again into the global final_result_array
            var rawResult_array = this.tool_FilteredByMachine;
            var selectedTInMachineName = this.SelectMachine;
            var self = this;
            //If the list of selected machine, empty the result array
            if (this.listofSelectedMachines.length == 0) {
                this.final_result_array = [];
            }
            //when a machine is selected
            if (selectedTInMachineName != "all") {
                if (this.listofSelectedMachines.indexOf(selectedTInMachineName) < 0) {
                    //take note of which is selected and dont add it again if added already
                    self.listofSelectedMachines.push(selectedTInMachineName);
                    //push value into the result array
                    for (var i = 0, u = rawResult_array.length; i < u; i++) {
                        self.final_result_array.push(rawResult_array[i]);
                    }
                    self.toolValues = self.final_result_array;
                }
            }
            //if all is selected
            else if (selectedTInMachineName == "all") {
                //empty both the result and list of selected machines
                this.final_result_array = [];
                this.listofSelectedMachines = [];
                //push into result everything.
                this.final_result_array = self.toolsJSON;
                this.toolValues = this.final_result_array;
                this.partValues = this.partsJSON;
            }
        },
        tool_FilteredByMachine: function () {
            var vm = this;
            var selectedTInMachineName = vm.SelectMachine;

            if (selectedTInMachineName == "all") {
                return vm.toolsJSON;
            }
            if (selectedTInMachineName == "notInstalled") {
                this.rawFilter = [];
                for (var i = 0, u = this.toolsJSON.length; i < u; i++) {
                    if (this.toolsJSON[i].MachineSerial == 0) {
                        vm.rawFilter.push(vm.toolsJSON[i]);
                    }
                }
                return this.rawFilter;
            }
            else {
                this.rawFilter = [];
                for (var i = 0, u = this.machineJSON.length; i < u; i++) {
                    //find the selected machine
                    if (vm.machineJSON[i].Name == selectedTInMachineName) {
                        //when found, loops through tools and see if the machine contain this tool
                        for (var x = 0, y = vm.toolsJSON.length; x < y; x++) {
                            //if found, push this tool to rawFilter
                            var middleManFor_X = x;
                            var middleManFor_I = i;
                            if (vm.machineJSON[middleManFor_I].ToolIds.
                                indexOf((vm.toolsJSON[middleManFor_X].Id)) > -1
                            ) {
                                vm.rawFilter.push(vm.toolsJSON[middleManFor_X]);                           
                            }
                        }
                    }
                }
                
                return this.rawFilter;
            }
        },

        //preparing value for included part info
        selectedTool_IncludedPartsValueFilter: function () {
            var self = this;           
            this.selectedTool_IncludedPartsValue = [];
            //Loop and get all part in tool
            for (var i = 0, u = self.toolDetailFromRowClick.PartIds.length; i < u; i++) {
                //search for this tool in the json
                for (var x = 0, y = self.partsJSON.length; x < y; x++){
                    if (self.toolDetailFromRowClick.PartIds[i] == self.partsJSON[x].Identifier) {
                        self.selectedTool_IncludedPartsValue.push(self.partsJSON[x])
                        break;//breaking since part id are unique.
                    }
                }
            }
        }
    }

})
