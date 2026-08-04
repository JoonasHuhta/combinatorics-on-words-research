const { BIGRAMS, enumerateSAbelian } = require('../scripts/b16-bigram-lattice.js');

function run() {
    const maxN = 8; // Small N for fast lattice reduction
    const budget = 1e6; // Small budget per mask, shouldn't hit it for N=8
    
    console.log(`Starting 512-lattice reduction at N=${maxN}...`);
    
    // Map of sequence (as string) -> list of masks
    const classes = new Map();
    
    for (let mask = 0; mask < 512; mask++) {
        const r = enumerateSAbelian(mask, maxN, budget);
        if (!r.exhausted) {
            console.error(`Mask ${mask} exhausted budget! Increase budget.`);
            process.exit(1);
        }
        
        // Use slice(1) to drop p(0)=1
        const seqStr = r.counts.slice(1, maxN + 1).join(',');
        
        if (!classes.has(seqStr)) {
            classes.set(seqStr, []);
        }
        classes.get(seqStr).push(mask);
    }
    
    console.log(`\nReduction complete: 512 masks collapsed into ${classes.size} distinct equivalence classes.`);
    
    let classId = 1;
    const representatives = [];
    
    for (const [seqStr, masks] of classes.entries()) {
        console.log(`\nClass ${classId}: p(n) = [${seqStr}]`);
        console.log(`  Count: ${masks.length} mask(s)`);
        
        // Pick the first mask as representative
        representatives.push({
            classId,
            mask: masks[0], // Representative mask
            size: masks.length,
            seqStr
        });
        classId++;
    }
    
    // Output representatives for next step
    console.log('\nRepresentatives to be run for larger N (Array of masks):');
    console.log(JSON.stringify(representatives.map(c => c.mask)));
}

run();
