// Generate an array of 'n' positive integers less than 'max'
function random_array(n: number, max: number): number[] {
    return Array.apply(null, Array(n)).map(function() {
        return Math.round(Math.random() * max);
    });
}