const math = require('mathjs');

const aa2f = [3, 9, 27, 66, 162, 360, 786, 1572, 3114, 5850, 11070, 20454, 37698, 67746, 120084, 207354, 352710, 584730, 958572, 1534644, 2442792, 3820194];
const aa2fr = [3, 9, 27, 60, 126, 234, 414, 696, 1146, 1782, 2802, 4350, 6732, 10218, 15390, 22446, 32598, 46452, 65790, 91878, 128286, 175860, 240384, 322794];
const asf4 = [4, 12, 36, 96, 264, 648, 1584, 3576, 7872, 15360, 29184, 51120, 90384, 158448, 286296, 509808, 904296, 1556304, 2638368];

function getHankelMatrix(seq, m) {
    let H = [];
    for (let i = 0; i < m; i++) {
        let row = [];
        for (let j = 0; j < m; j++) {
            // using exact mathjs fractions
            row.push(math.fraction(seq[i + j]));
        }
        H.push(row);
    }
    return H;
}

function computeRank(matrix) {
    let m = matrix.length;
    let rank = 0;
    
    // Gaussian elimination
    for (let col = 0; col < m; col++) {
        let pivotRow = -1;
        for (let row = rank; row < m; row++) {
            if (!math.equal(matrix[row][col], 0)) {
                pivotRow = row;
                break;
            }
        }
        
        if (pivotRow !== -1) {
            // Swap rows
            let temp = matrix[rank];
            matrix[rank] = matrix[pivotRow];
            matrix[pivotRow] = temp;
            
            // Normalize pivot row
            let pivotVal = matrix[rank][col];
            for (let j = col; j < m; j++) {
                matrix[rank][j] = math.divide(matrix[rank][j], pivotVal);
            }
            
            // Eliminate below
            for (let row = rank + 1; row < m; row++) {
                let factor = matrix[row][col];
                if (!math.equal(factor, 0)) {
                    for (let j = col; j < m; j++) {
                        matrix[row][j] = math.subtract(matrix[row][j], math.multiply(factor, matrix[rank][j]));
                    }
                }
            }
            rank++;
        }
    }
    return rank;
}

function testSeq(name, seq) {
    console.log(`\nHankel ranks for ${name}:`);
    for (let m = 1; m <= Math.floor(seq.length / 2); m++) {
        let H = getHankelMatrix(seq, m);
        let rank = computeRank(H);
        console.log(`Size ${m}x${m} -> Rank: ${rank} (Full rank? ${rank === m})`);
    }
}
testSeq("aa2f", aa2f);
testSeq("aa2fr", aa2fr);
testSeq("asf4", asf4);
