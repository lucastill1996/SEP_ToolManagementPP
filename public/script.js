new Vue({
    el: '#app',
    data: {
        machines: [{
            mId: 'm1',
            mName: 'Machines 1'
        },
        {
            mId: 'm2',
            mName: 'Machines 2'
        },
        {
            mId: 'm3',
            mName: 'Machines 3'
        },
        {
            mId: 'm4',
            mName: 'Machines 4'
        },
        {
            mId: 'm5',
            mName: 'Machines 5'
        },
        {
            mId: 'm6',
            mName: 'Machines 6'
        },
        {
            mId: 'm7',
            mName: 'Machines 7'
        }
        ],
        tools: [{
            tId: 1,
            tName: 'Tool 1',
            tCategory: 'Category 1',
            tInMachineID: 'm1',
            hitCount: 100
        },
        {
            tId: 2,
            tName: 'Tool 2',
            tCategory: 'Category 1',
            tInMachineID: 'm7',
            hitCount: 102
        },
        {
            tId: 3,
            tName: 'Tool 3',
            tCategory: 'Category 2',
            tInMachineID: 'm1',
            hitCount: 103
        },
        {
            tId: 4,
            tName: 'Tool 4',
            tCategory: 'Category 2',
            tInMachineID: 'm2',
            hitCount: 104
        },
        {
            tId: 5,
            tName: 'Tool 5',
            tCategory: 'Category 2',
            tInMachineID: 'm6',
            hitCount: 105
        },
        {
            tId: 6,
            tName: 'Tool 6',
            tCategory: 'Category 1',
            tInMachineID: 'm2',
            hitCount: 106
        },
        {
            tId: 7,
            tName: 'Tool 7',
            tCategory: 'Category 1',
            tInMachineID: 'm3',
            hitCount: 107
        },
        {
            tId: 8,
            tName: 'Tool 8',
            tCategory: 'Category 3',
            tInMachineID: 'm4',
            hitCount: 108
        },
        {
            tId: 9,
            tName: 'Tool 9',
            tCategory: 'Category 2',
            tInMachineID: 'm5',
            hitCount: 109
        },
        {
            tId: 10,
            tName: 'Tool 10',
            tCategory: 'Category 3',
            tInMachineID: 'm4',
            hitCount: 110
        },
        {
            tId: 11,
            tName: 'Tool 11',
            tCategory: 'Category 3',
            tInMachineID: 'm5',
            hitCount: 200
        }
        ],

        content: [],
        machineToggled: false
    },
    methods: {
        getContent: function (index) {
            var machine = this.machines[index];
            var tool = this.tools
            var mule = [];
            for (var i = 0; i < this.tools.length; i++) {
                if (this.tools[i].tInMachineID === machine.mId) {
                    mule.push({
                        tId: tool[i].tId,
                        tName: tool[i].tName,
                        tCategory: tool[i].tCategory,
                        hitCount: tool[i].hitCount
                    })
                }
            }
            this.content = mule;
            mule = [];
        }
    }
})