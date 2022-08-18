/*
Extract from: https://gist.github.com/LouisJenkinsCS/bd2654675781aef098b0f6a38b9c7c34
Thanks mr. Louis Jenkins for not sueing me
*/
void match (token expected) {
    if (input_token == expected) {
        printf ("matched %s", names[input_token]);
        if (input_token == t_id || input_token == t_literal)
            printf (": %s", token_image);
        printf ("\n");
        input_token = scan ();
    }
    else error ();
}

void program ();
void stmt_list ();
void stmt ();
void expr ();
void term_tail ();
void term ();
void factor_tail ();
void factor ();
void add_op ();
void mul_op ();

void program () {
    switch (input_token) {
        case t_id:
        case t_read:
        case t_write:
        case t_eof:
            printf ("predict program --> stmt_list eof\n");
            stmt_list ();
            match (t_eof);
            break;
        default: error ();
    }
}

void stmt_list () {
    switch (input_token) {
        case t_id:
        case t_read:
        case t_write:
            printf ("predict stmt_list --> stmt stmt_list\n");
            stmt ();
            stmt_list ();
            break;
        case t_eof:
            printf ("predict stmt_list --> epsilon\n");
            break;          /*  epsilon production */
        default: error ();
    }
}

void stmt () {
    switch (input_token) {
        case t_id:
            printf ("predict stmt --> id gets expr\n");
            match (t_id);
            match (t_gets);
            expr ();
            break;
        case t_read:
            printf ("predict stmt --> read id\n");
            match (t_read);
            match (t_id);
            break;
        case t_write:
            printf ("predict stmt --> write expr\n");
            match (t_write);
            expr ();
            break;
        default: error ();
    }
}

void expr () {
    switch (input_token) {
        case t_id:
        case t_literal:
        case t_lparen:
            printf ("predict expr --> term term_tail\n");
            term ();
            term_tail ();
            break;
        default: error ();
    }
}

void term_tail () {
    switch (input_token) {
        case t_add:
        case t_sub:
            printf ("predict term_tail --> add_op term term_tail\n");
            add_op ();
            term ();
            term_tail ();
            break;
        case t_rparen:
        case t_id:
        case t_read:
        case t_write:
        case t_eof:
            printf ("predict term_tail --> epsilon\n");
            break;          /*  epsilon production */
        default: error ();
    }
}

void term () {
    switch (input_token) {
        case t_id:
        case t_literal:
        case t_lparen:
            printf ("predict term --> factor factor_tail\n");
            factor ();
            factor_tail ();
            break;
        default: error ();
    }
}

void factor_tail () {
    switch (input_token) {
        case t_mul:
        case t_div:
            printf ("predict factor_tail --> mul_op factor factor_tail\n");
            mul_op ();
            factor ();
            factor_tail ();
            break;
        case t_add:
        case t_sub:
        case t_rparen:
        case t_id:
        case t_read:
        case t_write:
        case t_eof:
            printf ("predict factor_tail --> epsilon\n");
            break;          /*  epsilon production */
        default: error ();
    }
}

void factor () {
    switch (input_token) {
        case t_id :
            printf ("predict factor --> id\n");
            match (t_id);
            break;
        case t_literal:
            printf ("predict factor --> literal\n");
            match (t_literal);
            break;
        case t_lparen:
            printf ("predict factor --> lparen expr rparen\n");
            match (t_lparen);
            expr ();
            match (t_rparen);
            break;
        default: error ();
    }
}

void add_op () {
    switch (input_token) {
        case t_add:
            printf ("predict add_op --> add\n");
            match (t_add);
            break;
        case t_sub:
            printf ("predict add_op --> sub\n");
            match (t_sub);
            break;
        default: error ();
    }
}

void mul_op () {
    switch (input_token) {
        case t_mul:
            printf ("predict mul_op --> mul\n");
            match (t_mul);
            break;
        case t_div:
            printf ("predict mul_op --> div\n");
            match (t_div);
            break;
        default: error ();
    }
}

int main () {
    input_token = scan ();
    program ();
    return 0;
}
scan.c
/* Simple ad-hoc scanner for the calculator language.
    Michael L. Scott, 2008-2019.
*/

#include "stdio.h"
#include "stdlib.h"
#include "string.h"
#include "ctype.h"

#include "scan.h"

char token_image[MAX_TOKEN_LEN];

token scan() {
    static int c = ' ';
        /* next available char; extra (int) width accommodates EOF */
    int i = 0;              /* index into token_image */

    /* skip white space */
    while (isspace(c)) {
        c = getchar();
    }
    if (c == EOF)
        return t_eof;
    if (isalpha(c)) {
        do {
            token_image[i++] = c;
            if (i >= MAX_TOKEN_LEN) {
                printf("max token length exceeded\n");
                exit(1);
            }
            c = getchar();
        } while (isalpha(c) || isdigit(c) || c == '_');
        token_image[i] = '\0';
        if (!strcmp(token_image, "read")) return t_read;
        else if (!strcmp(token_image, "write")) return t_write;
        else return t_id;
    }
    else if (isdigit(c)) {
        do {
            token_image[i++] = c;
            c = getchar();
        } while (isdigit(c));
        token_image[i] = '\0';
        return t_literal;
    } else switch (c) {
        case ':':
            if ((c = getchar()) != '=') {
                fprintf(stderr, "error\n");
                exit(1);
            } else {
                c = getchar();
                return t_gets;
            }
            break;
        case '+': c = getchar(); return t_add;
        case '-': c = getchar(); return t_sub;
        case '*': c = getchar(); return t_mul;
        case '/': c = getchar(); return t_div;
        case '(': c = getchar(); return t_lparen;
        case ')': c = getchar(); return t_rparen;
        default:
            printf("error\n");
            exit(1);
    }
}