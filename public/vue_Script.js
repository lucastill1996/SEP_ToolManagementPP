//Handling row click
//Method to handle clicked row in vue
var handleRow = function (event, entry) {
    rowResultHolder = "CLICK ROW: " + JSON.stringify(entry);
    myVue.toolDetailFromRowClick = (entry);
};

//Vue components
var myVue =new Vue({
    el: '#app',
    components: {
        VueBootstrapTable: VueBootstrapTable
    },
    data: {
        sortKey: '',
        reverse: false,
        searchString: '',

        SelectMachine: 'all',
        //Arrays for machine, tools, parts
        machineJSON: [],
        toolsJSON: [],
        partsJSON:[],
        //Array consist of filtered result from the combo box
        rawFilter: [],
        //Array to keep track of which machine was selected by comboBox
        listofSelectedMachines: [],
        //Array consist of the filtered result from BOTH comboBox and searchBar
        final_result_array: [],
        //Testing

        logging: [],
        showFilter: true,
        showPicker: true,
        paginated: true,
        multiColumnSortable: true,
        filterCaseSensitive: false,

        handleRowFunction: handleRow,
        toolColumns: [
            {
                title: "Tool Name",
                name:"Name",
                visible: true,
                editable: false,
            },
            {
                title: "Shape",
                name: "Shape",
                visible: true,
                editable: true,
            },
            {
                title: "Size",
                name: "Size",
                visible: true,
                editable: true,
            },
            {
                title: "Diameter",
                name: "Diameter",
                visible: true,
                editable: true,
            },
            {
                title: "Type",
                name: "Type",
                visible: true,
                editable: true,
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
                editable: true,
            },
            {
                title: "Hitcount",
                name: "Hitcount",
                visible: true,
                editable: true,
            }
        ],
        partValues: [],
        toolDetailFromRowClick:""
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
                })
                .catch(function (error) {
                    console.log(error);
                });
            //json3 for partJSON
            axios.get(jsonURL3)
                .then(function (response) {
                    self.partsJSON = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
            
        }

        //testing         
    },
    computed: {
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
        //This can be combined with the method follow, since vue-bootstrap-table already have built in table
        tools_filtered_by_searchAndBox: function () {

            //rawResult_array recieve objects from filteredMachine, 
            //and will get filtered again into the global final_result_array
            var rawResult_array = this.tool_FilteredByMachine,
                searchString = this.searchString;
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

            if (!searchString) {
                return this.final_result_array;
            }

            searchString = searchString.trim().toLowerCase();

            rawResult_array = rawResult_array.filter(function (item) {
                if (item.Name.toLowerCase().indexOf(searchString) !== -1) {
                    return item;
                }
            })
            return rawResult_array;
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
                            if (vm.machineJSON[middleManFor_I].ToolIds.indexOf(vm.toolsJSON[middleManFor_X].toolID) > -1) {
                                vm.rawFilter.push(vm.toolsJSON[middleManFor_X]);
                            }
                        }
                    }
                }
                return this.rawFilter;
            }
        }
    }

})
