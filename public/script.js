new Vue({
    el: '#app',
    data: {
		sortKey: '',
        reverse: false,
        searchString: '',
		
        SelectMachine: 'all',
        tools: [ ],
		
    },
	//calling the method which load the json file at the loading of he page
	created: function () {
        this.fetchData();
    },
	//calling the json
    methods: {
        fetchData: function () {
            var jsonURL = "http://www.cc.puv.fi/~e1400459/SEP_ToolManagementPP-master/public/file.json";
            var self=this;
            axios.get(jsonURL)
            .then(function (response) {
                self.tools=response.data;
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
		
		
		filtered: function() {
			var tool_array = this.filteredPeople,
                searchString = this.searchString;

            if(!searchString){
                return tool_array;
            }

            searchString = searchString.trim().toLowerCase();

            tool_array = tool_array.filter(function(item){
                if(item.tName.toLowerCase().indexOf(searchString) !== -1){
                    return item;
                }
            })


            return tool_array;
		},
		
		
		
		
		
		filteredPeople: function() {
			var vm = this;
			var tInMachineName = vm.SelectMachine;


			if(tInMachineName == "all") {
		
				return vm.tools;
			} else {
				return vm.tools.filter(function(person) {
					
					return  ( person.tInMachineName == tInMachineName) ;	 

				});
			}
			
			
		
	 
		
		}
    }
    
    
})
