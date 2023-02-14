const isProduction = (): boolean => {
    return process.env.PRODUCTION === "true";
};

export default isProduction;
