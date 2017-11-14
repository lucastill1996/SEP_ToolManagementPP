new Vue({
    el: '#app',
    data: {
		sortKey: '',
        reverse: false,
        searchString: '',
		
        SelectMachine: 'all',
        tools: [], //tools contain the retrieved information from data.json
        machineJSON: [],
        toolsJSON: [],
        final_result_array:[],
        listofSelectedMachines: []
    },
	//calling the method which load the json file at the loading of he page
	created: function () {
        this.fetchData();
    },
	//calling the json
    methods: {
        fetchData: function () {
            var jsonURL0 = "public/data.json";
            var jsonURL1= "public/newmachine.json";
            var jsonURL2 = "public/tools.json";
            var self = this;
            //json0
            axios.get(jsonURL0)
                .then(function (response) {
                    self.tools = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
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
            for (var i = 0; i < self.tools.length; i++) {
                mules.push({
                    mName: self.tools[i].tInMachineName                        
                });
            }
            mules = _.sortBy(mules,'mName')
            result = _.uniq(_.map(mules, 'mName')); 
            return result;
        },
		
		
        filtered: function () {
            //rawResult_array recieve objects from filteredMachine, 
            //and will get filtered again into the global final_result_array
            var rawResult_array = this.filteredMachine,
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
                this.final_result_array = self.tools;
            }
                           
            if(!searchString){
                return this.final_result_array;
            }

            searchString = searchString.trim().toLowerCase();

            rawResult_array = rawResult_array.filter(function(item){
                if(item.tName.toLowerCase().indexOf(searchString) !== -1){
                    return item;
                }
            })


            return rawResult_array;
		},
		
		//Returning object of tools that have machine id required		
		filteredMachine: function() {
			var vm = this;
			var selectedTInMachineName = vm.SelectMachine;

            if (selectedTInMachineName == "all") {
				return vm.tools;
            }
            else {
                return vm.tools.filter(
                    function (tool) {					
                        return (tool.tInMachineName == selectedTInMachineName) ;	 
                    }
                );
			}
		}
    }
    
    
})
