import { gql } from '@apollo/client';

export const AUTH = gql`
mutation auth($link:String!,$code:String){
    app_auth(link:$link,code:$code){
        process
        accessToken
        refreshToken
        tel_id
    }
}
`;
export const REWARDED = gql`
mutation app_rewarded($key:String!){
    app_rewarded(key:$key){
        message
        state
        points
    }
}
`;

export const ME = gql`
query me($tel_id:String!){
    clients_by_pk(tel_id:$tel_id){
        ban_times
        block_time
        tel_id
        first_name
        points
        gender
        created_at
        entered_by
        is_trust
        last_seen
        info{
            about_me
            birthday
            country
            education
            governorate
            work
        }
    }
}
`;

export const UPSERT_USER_INFO = gql`
mutation upsert_info($object:user_info_insert_input!,$on_conflict:user_info_on_conflict){
  insert_user_info_one(object:$object,on_conflict:$on_conflict){
    birthday
    country
    education
    governorate
    work
  }
}
`;

export const PURCHASE = gql`
mutation purchase($receipt:json!){
  app_purchase(receipt:$receipt){
    status
  }
}
`;