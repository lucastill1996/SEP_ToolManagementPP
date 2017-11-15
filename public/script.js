new Vue({
    el: '#app',
    data: {
        sortKey: '',
        reverse: false,
        searchString: '',

        SelectMachine: 'all',
        //Arrays for machine, tools, parts
        machineJSON: [],
        toolsJSON: [],
        //Array consist of filtered result from the combo box
        rawFilter: [],
        //Array to keep track of which machine was selected by comboBox
        listofSelectedMachines: [],
        //Array consist of the filtered result from BOTH comboBox and searchBar
        final_result_array: [],
        
    },
    //calling the method which load the json file at the loading of he page
    created: function () {
        this.fetchData();
    },
    //calling the json
    methods: {
        fetchData: function () {
            var jsonURL1 = "public/Json/newmachine.json"; //consist of machine information, and the list of ID of tools in those machines
            var jsonURL2 = "public/Json/tools.json";//consist of tools information
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
        }
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
                        this.final_result_array.push(rawResult_array[i]);
                    }
                }
            }
            //if all is selected
            else if (selectedTInMachineName == "all") {
                //empty both the result and list of selected machines
                this.final_result_array = [];
                this.listofSelectedMachines = [];
                //push into result everything.
                this.final_result_array = self.toolsJSON;
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
                            if (vm.machineJSON[middleManFor_I].ToolIds.indexOf(vm.toolsJSON[middleManFor_X].toolID) >-1) {
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
