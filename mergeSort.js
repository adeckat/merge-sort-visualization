// declare global variables
var arr = []
var steps = []
var length = 40;
var isSorted = false;

// store random value in arr[]
while (arr.length < length) {
    var r = Math.floor(Math.random() * 200) + 1;
    if (arr.indexOf(r) === -1)
        arr.push(r);
}

var svg, barChart, text, xScale, yScale;
var durationTime = 150;
var chartWidth = 1400, chartHeight = 400, barPadding = 5;
var barWidth = chartWidth / arr.length;

// select environment
svg = d3.select('#canvas')
    .attr('width', chartWidth)
    .attr('height', chartHeight)

// xScale will help us set the x position of the bars
xScale = d3.scaleBand() //Ordinal scale
    .domain([0, arr.length])  //sets the input domain for the scale
    .range([0, barWidth])//enables rounding of the range
    .paddingInner(barPadding); //spacing between each bar

//yScale will help us map data to the height of bars in the barchart
yScale = d3.scaleLinear()
    .domain([0, d3.max(arr)])
    .range([0, chartHeight - 28])

// generate bar and text present array's element values
barChart = svg.selectAll('g')
    .data(arr)
    .enter()
    .append('g')

barChart.append('rect')
    .attr('id', function (d) { return 'rect' + d })
    .attr('x', function (d, i) {
        return i * barWidth;
    })
    .attr('y', function (d) {
        return chartHeight - yScale(d);
    })
    .attr('height', function (d) {
        return yScale(d);
    })
    .attr('width', barWidth - barPadding)
    .attr('fill', getRandomColor())
    .attr('transform', function (d, i) {
        return 'translate(0, 0)';
    });

barChart.append('text')
    .attr('id', function (d) { return 'text' + d })
    .html(function (d) { return d; })
    .text(function (d) {
        return d;
    })
    .attr('y', function (d, i) {
        return chartHeight - yScale(d) - 7;
    })
    .attr('x', function (d, i) {
        return barWidth * i + 5;
    })
    .attr('fill', 'black');

// reset function returns new array
function reset() {
    // document.getElementById("sortBtn").disabled = false;
    isSorted = false;
    var newText1 = d3.select('#info').text("Data is unsorted");
    
    arr = [];
    steps = [];

    while (arr.length < length) {
        var r = Math.floor(Math.random() * 200) + 1;
        if (arr.indexOf(r) === -1)
            arr.push(r);
    }

    barChart.data(arr);
    barChart.select('rect')
        .transition().duration(durationTime)
        .attr('id', function (d) { return 'rect' + d })
        .attr('x', function (d, i) {
            return i * barWidth;
        })
        .attr('y', function (d) {
            return chartHeight - yScale(d);
        })
        .attr('height', function (d) {
            return yScale(d);
        })
        .attr('fill', getRandomColor())
        .attr('transform', function (d, i) {
            return 'translate(0, 0)';
        })

    barChart.select('text')
        .transition().duration(durationTime)
        .attr('id', function (d) { return 'text' + d })
        .text(function (d) {
            return d;
        })
        .attr('y', function (d, i) {
            return chartHeight - yScale(d) - 7;
        })
        .attr('x', function (d, i) {
            return barWidth * i + 5;
        })
        .attr('transform', function (d, i) {
            return 'translate(0, 0)';
        })
    return arr;
}

// generate random color for bar chart
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// merge sort algorithm
function mergeSort(arr) {
    
    // recursion base case
    // it checks if the array length is less than or equal to 1.
    // if that's the case return the arr else keep splicing.
    // console.log("CHECK3333: ", arr);
    if (arr.length <= 1) { return arr;}
    
    // remember that we said merge sort uses divide and conquer
    // algorithm pattern

    // it firsts know the half point of the array.
    let halfPoint = Math.ceil(arr.length / 2);

    // and then splice the array from the beginning up to the half point.
    // but for the fact that merge sort needs the array to be of one element, it will keep splicing that half till it fulfills the condition of having one element array.
    let firstHalf = mergeSort(arr.splice(0, halfPoint));

    // second array from the half point up to the end of the array.
    let secondHalf = mergeSort(arr.splice(-halfPoint));

    // merge the array back and return the result.
    // note that we are using the helper function we created above.
    return merge(firstHalf, secondHalf);
    
    function merge(arr1, arr2) {
        let result = []; // the array to hold results.
        let i = 0;
        let j = 0;

        steps.push(arr1);
        steps.push(arr2);

        // as the pseudo-code implies, we have to loop through the 
        // arrays at the same time and it has to be done once.
        // note that if one array completes its iteration, we will
        // have to stop the while loop.
        while (i < arr1.length && j < arr2.length) {
            // compare the elements one at a time.
            if (arr1[i] > arr2[j]) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }

        // these other while loops checks if there's some item left
        // in the arrays so that we can push their elements in the result array.
        while (i < arr1.length) {
            result.push(arr1[i]);
            i++;
        }

        while (j < arr2.length) {
            result.push(arr2[j]);
            j++;
        }
        return result;
    }
}

// animation function
async function animate(steps) {
    var counter = 0, left, right, x1, x2;
    var color = getRandomColor();

    while (counter < steps.length - 1) {
        var newText2 = d3.select('#info').text('Sorting data...');
        left = steps[counter];
        counter++;
        right = steps[counter]
        counter++;

        var i = 0;
        var j = 0;
        var numSorted = 0;

        // Farthest left is always the starting point
        x1 = parseInt(d3.select('#rect' + left[0]).attr('x'));
        for (let i = 1; i < left.length; i++) {
            if (parseInt(d3.select('#rect' + left[i]).attr('x')) < x1) {
                x1 = parseInt(d3.select('#rect' + left[i]).attr('x'));
            }
        }

        // compare and swap bars' positions if needed
        while (i < left.length && j < right.length) {
            if (left[i] > right[j]) {
                x2 = d3.select('#rect' + right[j]).attr('x');
                await d3.select('#rect' + right[j])
                    .transition().duration(durationTime)
                    .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                    .attr('fill', 'cyan')
                    .transition().duration(durationTime)
                    .attr('fill', color)
                    .each(function () {
                        d3.select('#text' + right[j])
                            .transition().duration(durationTime)
                            .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                    })
                    .end()
                j++;
                numSorted++;

            } else {
                x2 = d3.select('#rect' + left[i]).attr('x');
                await d3.select('#rect' + left[i]).transition()
                    .duration(durationTime)
                    .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                    .attr('fill', 'cyan')
                    .transition().duration(durationTime)
                    .attr('fill', color)
                    .each(function () {
                        d3.select('#text' + left[i])
                            .transition().duration(durationTime)
                            .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                    })
                    .end()
                i++;
                numSorted++;
            }
        }
        while (i < left.length) {
            x2 = d3.select('#rect' + left[i]).attr('x');
            await d3.select('#rect' + left[i])
                .transition().duration(durationTime)
                .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                .attr('fill', 'cyan')
                .transition().duration(durationTime)
                .attr('fill', color)
                .each(function () {
                    d3.select('#text' + left[i])
                        .transition().duration(durationTime)
                        .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                })
                .end()
            i++;
            numSorted++;
        }

        while (j < right.length) {
            x2 = d3.select('#rect' + right[j]).attr('x');
            await d3.select('#rect' + right[j])
                .transition().duration(durationTime)
                .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                .attr('fill', 'cyan')
                .transition().duration(durationTime)
                .attr('fill', color)
                .each(function () {
                    d3.select('#text' + right[j])
                        .transition().duration(durationTime)
                        .attr('transform', function (d) { return 'translate(' + (parseInt(x1) + (barWidth * numSorted) - parseInt(x2)) + ', 0)' })
                })
                .end()
            j++;
            numSorted++;
        }

    }
    var newText3 = d3.selectAll('#info').text('Data is sorted');
}

function visualization() {
    if (isSorted)
        return;
    mergeSort(arr);
    animate(steps);
    isSorted = true;
    // document.getElementById("sortBtn").disabled = true;
}