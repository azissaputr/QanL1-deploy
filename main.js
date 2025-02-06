let maxUser = 100;

function construct() {
    if (process.env.DB_QVM_INITIALIZED === "true") {
        process.stderr.write("contract is already initialized\n");
        process.exit(1);
    }
    process.stdout.write("DBW=QVM_INIT_MAXUSER=" + maxUser);
    process.stdout.write("\n");
    process.exit(0);
}

function initialize() {
    if (process.env.DB_QVM_INITIALIZED !== "true") {
        process.stderr.write("contract is not initialized\n");
        process.exit(1);
    }
    maxUser = parseInt(process.env.DB_QVM_INIT_MAXUSER || "0");
}

function contract(args) {
    if (args && args.length === 1 && args[0] === "construct") {
        construct();
    }
    // THIS SAMPLE ONLY SUPPORTS THE "register" FUNCTION
    if (args && args.length === 2 && args[0] === "register") {
        initialize();
        // GET THE CURRENT USER'S NAME OR DEFAULT TO "unknown" IF THIS IS THE FIRST CALL
        const previous_name = process.env.DB_USER_CURRENT || "unknown";
        // GET THE TOTAL USER COUNT
        const total_user_count = parseInt(process.env.DB_TOTALUSERS || "0");
        if (total_user_count + 1 > maxUser) {
            process.stderr.write("exceeded max user\n");
            process.exit(1);
        }
        // WRITE PREVIOUS USER NAME TO STDOUT
        process.stdout.write("OUT=prevname: " + previous_name);
        process.stdout.write("\n");
        // UPDATE CURRENT USER NAME BY WRITING IT TO DB
        process.stdout.write("DBW=USER_CURRENT=" + args[1]);
        process.stdout.write("\n");
        // STORE USER NAME UNDER A STORAGE SLOT FOR PERSISTENCE (CURRENT GETS OVERWRITTEN ON EACH CALL)
        process.stdout.write("DBW=USER_" + total_user_count + "=" + args[1]);
        process.stdout.write("\n");
        // INCREMENT THE TOTAL USER COUNT
        process.stdout.write("DBW=TOTALUSERS=" + (total_user_count + 1));
        process.stdout.write("\n");
        process.exit(0);
    }
    if (args.length >= 1) {
        process.stderr.write("Wrong CMD: " + args[0]);
        process.stderr.write("\n");
        process.exit(1);
    }
    process.stderr.write("Wrong args!");
    process.stderr.write("\n");
    process.exit(1);
}
contract(process.argv.slice(2));