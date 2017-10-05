new Vue({
    el: '#app',
    data: {
        tools: [{
            tId: 1,
            tName: 'Tool 1',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 1',
            hitCount: 100
        },
        {
            tId: 2,
            tName: 'Tool 2',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 7',
            hitCount: 102
        },
        {
            tId: 3,
            tName: 'Tool 3',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 1',
            hitCount: 103
        },
        {
            tId: 4,
            tName: 'Tool 4',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 2',
            hitCount: 104
        },
        {
            tId: 5,
            tName: 'Tool 5',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 6',
            hitCount: 105
        },
        {
            tId: 6,
            tName: 'Tool 6',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 2',
            hitCount: 106
        },
        {
            tId: 7,
            tName: 'Tool 7',
            tCategory: 'Category 1',
            tInMachineName: 'Machine 3',
            hitCount: 107
        },
        {
            tId: 8,
            tName: 'Tool 8',
            tCategory: 'Category 3',
            tInMachineName: 'Machine 4',
            hitCount: 108
        },
        {
            tId: 9,
            tName: 'Tool 9',
            tCategory: 'Category 2',
            tInMachineName: 'Machine 5',
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
            tInMachineName: 'Machine 6',
            hitCount: 200
        }
        ],
        machines:''
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
        }
            
    }
    
    
})