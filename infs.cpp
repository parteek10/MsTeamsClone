now we have to monyey to b , 

initally y 
        x 

        x + y , 

        z 
        y -z  

        x + y / y-z 
        





// #include<bits/stdc++.h>
// typedef long long ll ;
// using namespace std ;

// string reverse(string &str )  {
//     int n = str.size() ; 
//     n-- ; 
//     string result = "" ; 
//     while(n>=0)  {
//         result += str[n] ; 
//         n-- ; 
//     }
//     return result ; 
// } 

// int main() {
//     ll t ; 
//     cin>>t ; 
//     while(t--)  {
//         ll n  , i , j ,k ; 
//         string str , result = ""; 

//         cin>>str ; 
//         n = str.size() ; 

//         if(n==0) {
//             cout<<result << endl; 
//             continue ; 
//         }
    
//         stack<char> stk ; 
//         stk.push(str[0]) ; 
//         int flag = 0 ; 
//         i = 1 ; 

//         i = 5 ;
//         stk : 
//         while(i < n )  {
//             flag = 0 ; 
//             while(i < n && stk.empty()==false && stk.top() == str[i])  {
//                 i++ ; 
//                 flag = 1 ; 
//             }

//             if(stk.empty()==false && flag == 1 )  {
//                 stk.pop() ; 
//             }
//             else if(i<n) {
//                 stk.push(str[i]) ;
//                 i++ ; 
//             }
//             else 
//               break ; 
//         } 

//         while(stk.empty()==false)  {
//             result += stk.top() ; 
//             stk.pop() ; 
//         }
        
//         result = reverse(result) ; 

//         cout<<result<<endl ;
//     }
//     return 0 ;
// }










// // #include <bits/stdc++.h>
// // typedef long long ll;
// // using namespace std;

// // string intToString(ll n)
// // {
// //     string result = "";
// //     while (n != 0)
// //     {
// //         result += (n % 10 + '0');
// //         n = n / 10;
// //     }
// //     return result;
// // }

// // int main()
// // {
// //     // #ifndef ONLINE_JUDGE
// //     // freopen("input.txt", "r", stdin);
// //     // freopen("output.txt", "w", stdout);
// //     // #endif
// //     ll t;
// //     cin >> t;
// //     while (t--)
// //     {
// //         ll n, i, j, k;
// //         cin >> n;

// //         string num = intToString(n);
// //         int digits = num.size();
// //         string result = "";

// //         if (digits % 2 == 1)
// //         {
// //             i = digits / 2;
// //             j = digits / 2;
// //             if (num[i] != '9')
// //             {
// //                 num[i] = num[i] + 1;
// //                 result = num;
// //             }
// //             else
// //             {
// //                 i--;
// //                 j++;
// //                 while (i >= 0 && num[i] == '9')
// //                     i--, j++;
// //                 if (i == -1)
// //                 {
// //                     result = "1";
// //                     for (k = 0; k < digits - 1; k++)
// //                         result += "0";
// //                     result += "1";
// //                 }
// //                 else
// //                 {
// //                     num[i] = num[i] + 1;
// //                     num[j] = num[j] + 1;
// //                     result = num;
// //                 }
// //             }
// //         }
// //         else
// //         {
// //             i = digits / 2 - 1;
// //             j = digits / 2;
// //             while (i >= 0 && num[i] == '9')
// //                 i--, j++;
// //             if (i == -1)
// //             {
// //                 result = "1";
// //                 for (k = 0; k < digits - 1; k++)
// //                 {
// //                     result += "0";
// //                 }
// //                 result += "1";
// //             }
// //             else
// //             {
// //                 num[i] = num[i] + 1;
// //                 num[j] = num[j] + 1;
// //                 result = num;
// //             }
// //         }

// //         cout << result << endl;
// //     }
// //     return 0;
// // }