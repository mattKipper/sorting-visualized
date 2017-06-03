// Swap elements in an array at indexes i and j
function swap_elements<T>(array: Array<T>, i: number, j: number) {
    let i_val: T = array[i];
    array[i] = array[j];
    array[j] = i_val;
}

// Shuffle an array with Knuth's algorithm 
function shuffle_array<T>(array: Array<T>) {
    for(let i: number = array.length - 1; i > 0; i--) {
        let j: number = Math.floor(Math.random() * (i + 1));
        swap_elements(array, i, j);
    }
}

// Generate an array of integers from 0 to n (non-inclusive)
function range(n: number): Array<number> {
    return Array.apply(null, Array(n)).map(
        function(_, i) { return i; }
    );
}

// Generates a shuffled version of range(n)
function shuffled_range(n: number): Array<number> {
    let arr = range(n);
    shuffle_array(arr);
    return arr;
}

// Merge two sorted arrays into a combined, sorted array. 
function merge<T>(a: Array<T>, b: Array<T>): Array<T> {

    let result: Array<T> = new Array();
    let size: number = a.length + b.length;

    // Iterate through all elements in both arrays, popping the head (min) of
    // one array each time. 
    // Invariants:
    // a.length + b.lenth == size - i
    // result.size == i
    // a, b and result are all sorted
    for(let i: number = 0; i < size; ++i) {

        // Pop the head off 'a' if it exists and is less than the head of 'b'.
        if(a.length > 0 && (b.length === 0 || (a[0] <= b[0])))  {
            result.push(a.shift());
        }
        else {
            result.push(b.shift());
        }
    }

    return result;
}

// HSL colors are used to draw the representation of each sort -- hue
// and saturation are held constant for each sort and lightness is
// aletered to represent the values being sorted. 
class ColorSpectrum {
    hue: number;
    saturation_percent: number;

    constructor(hue: number, saturation_percent: number) {
        this.hue = hue; 
        this.saturation_percent = saturation_percent;
    }

    to_css(lightness_percent: number): string {
        return "hsl(" + String(this.hue) + "," +
                        String(this.saturation_percent) + "%," +
                        String(lightness_percent) + "%)";
    }
}

// Define a few global parameters for the merge visualization
let merge_spectrum = new ColorSpectrum(300, 75); 
let merge_item_count = 128;

// Perform a merge sort on the array, drawing a representation of the
// sort to the page. The 'number' arg keeps track of recursion depth
// for drawing purposes.
function merge_sort(arr: Array<number>, row: number = 0): Array<number> {
    if(arr.length === 1) {
        append_result(arr, row, "merge", merge_spectrum);
        return arr;
    }

    let mid: number = Math.floor(arr.length / 2);

    let a = merge_sort(arr.slice(0, mid), row + 1);
    let b = merge_sort(arr.slice(mid, arr.length), row + 1);

    let result = merge(a,b);

    append_result(result, row, "merge", merge_spectrum);

    return result;
}



// Appends a visual representation of the items in 'arr' to the 'row_num' row.
// 'sort_name' is a prefix for the row/container IDs, allowing for multiple
// sorts to potentially reuse this. 
function append_result(arr: Array<number>, row_num: number, sort_name: string,
                       color: ColorSpectrum) {

    // Check if a row exists at the given row. If not, create one
    let row_id: string = sort_name + "_row_" + String(row_num);
    let row = document.getElementById(row_id);

    if(!row) {
        row = document.createElement("div");
        row.className = "row";
        row.id = row_id;
        document.getElementById(sort_name + "_container").appendChild(row);
    }

    // For every element in the array, add an item to the row
    for(let i = 0; i < arr.length; ++i) {

        let item: number = arr[i];

        let item_node = document.createElement("div");
        item_node.className = sort_name + "_item";
        item_node.style.width = String(100 / merge_item_count) + "%";

        // The color of the item has a fixed hue/saturation, and the lightness
        // is distributed evenly across all items. Arbitrarily, we use 15%
        // as the min and 75% as the max
        let max_light = 90, min_light = 30;
        let lightness = (item / merge_item_count) * (max_light - min_light) + min_light;
        let color_css = color.to_css(lightness);
        item_node.style.backgroundColor = color_css;

        row.appendChild(item_node);
    }
}

window.onload = function() {
    let items = shuffled_range(merge_item_count);
    merge_sort(items);
}