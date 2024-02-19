export default function shortenAddress(address?: string, len = 4) {

    const str = address || ""

    if (str?.length < 11)
        return str;
    return `${str?.substring(0, len)}...${str?.substring(str?.length - len, str?.length)}`;
}