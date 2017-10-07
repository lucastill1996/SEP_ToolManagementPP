new Vue({
    el: '#app',
    data: {
		sortKey: '',
        reverse: false,
        searchString: '',
		
        SelectMachine: 'all',
        tools: [{
            tId: 1,
            tName: 'Danh ngao',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 1',
            hitCount: 100
        },
        {
            tId: 2,
            tName: 'Ngao Danh',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 2',
            hitCount: 102
        },
        {
            tId: 3,
            tName: 'Thien dep trai',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 3',
            hitCount: 103
        },
        {
            tId: 4,
            tName: 'Peter',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 1',
            hitCount: 104
        },
        {
            tId: 5,
            tName: 'Tool 5',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 2',
            hitCount: 105
        },
        {
            tId: 6,
            tName: 'Tool 6',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 3',
            hitCount: 106
        },
        {
            tId: 7,
            tName: 'Tool 7',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 1',
            hitCount: 107
        },
        {
            tId: 8,
            tName: 'Tool 8',
            tCategory: 'Category 3',
            tInMachineName: 'Machine 3',
            hitCount: 108
        },
        {
            tId: 9,
            tName: 'Tool 9',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 2',
            hitCount: 109
        },
        {
            tId: 10,
            tName: 'Tool 10',
            tCategory: 'Category 3',
            tInMachineName: 'Machine 4',
            hitCount: 110
        },
        {
            tId: 11,
            tName: 'Tool 11',
            tCategory: 'Category 3',
            tInMachineName: 'Machine 2',
            hitCount: 200
        }
        ],
		
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
