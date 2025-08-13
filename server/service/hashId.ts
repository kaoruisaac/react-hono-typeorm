import Hash from 'hashids';

const { HASH_SALT } = process.env;
const hashId = new Hash(HASH_SALT, 10);
const hashIds = {
    decode: (hash: string) => Number(hashId.decode(hash)),
    encode: (id: number) => hashId.encode(id),
}; 

export default hashIds;
