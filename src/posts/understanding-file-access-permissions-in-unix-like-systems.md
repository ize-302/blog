---
title: Understanding file access permissions in Unix-like systems
summary: Teaching you file access permissions like you are in kindergaten
date: 2023-12-13
published: true
tags: ["Linux"]
---

Before we jump right in, allow me to test your knowledge on this topic. Take a look at this list below, Can you confidently interpret the file access permissions on each line?

```sh
drwxr-xr-x   7 user1  group3   224 Jun 10  2022 nodejs-tutorials
-rw-rw-r--   3 user1  group1    96 Nov 25 00:25 hello_world.txt
drwxr--r--  20 user3  group2   640 Oct 23 18:56 docker-notes
lrwxr-xr--   3 user1  group2    96 Sep 12 10:58 repos
-rwxr-xr-x  11 user2  group1   352 Oct  5 11:42 main.sh
```

If your answer is "NO," then this article is for you. Here, Together, we will explore the concept of file access permissions, including its composition, various access levels, how to grant user and group access to a file, and more. By the end, you should have a comprehensive understanding of this topic.

BTW, the strange looking characters at the beginning of each line are called 'permission bits'. They are a set of flags in a Unix-like operating system that define the access rights of a file or directory.

## So what is file access permission?

File access permissions refer to the rules and settings that determines who can perform specific actions (such as reading, writing, or executing) on a file or directory within a computer's file system.

It shouldn't be surprising that at the core of file access permissions are files, permissions and access levels. So let let us take a look at each aspect:

## Files

Files are categorised into several types based on their characteristics and usage. They include:

- Regular file: These are the most common type of files that contain data, such as texts, images, or programs. In Unix based file systems, files are represented by the '-' character
- Directory: These files contain lists of other files and directories. They are represented by the 'd' character
- Symbolic link or symlink: These are links or references to existing files or directories. They allow you to create a link to a target file or directory from another location in the file system. Symbolic links are represented by the 'l' character

## Permissions

Every file or directory that exists in a system has permission and access level depending on the desired need. Permissions for a file can be one of or a combination of read, write and execute:

- Read permission allows reading a file's contents and listing a directory's contents, respectively. It is represented by the letter 'r'
- Write permission allows for the modification of a file’s contents and creating, deleting, and renaming files within a directory. Write permission is represented by the letter 'w'
- Execute permission allows executing the file if it is a program or script and accessing a directory. It is represented by the letter 'x'

## Access levels

Each permission 'read' 'write' 'execute' can be controlled within three(3) access levels of user, group and others;

- User represents the owner of the file or directory
- Group represents a collection of users associated with the file or directory
- Others represents every other user in the system who are not the owner and also do not belong to the group associated with that file or directory

This diagram below breaks down permission bits, illustrating how file type is presented and how permissions are represented for each access level

![diagram showing the breakdown of permission bits](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5byjegq48by91fw6q4qo.png)

- The first letter in this case the letter 'd' represents the file type which is a directory
- The next 3 characters represent permissions for the user or owner of the file
- The following 3 characters in green represent the members of the associated group
- The last 3 characters represent permissions for others who do not own the directory or are not members of the associated group

Now that you understand the composition of permission bits, let us apply this new found knowledge to the example we saw earlier. I added some comments explaining each section:

```sh
# d: 'nodejs-tutorials' is a directory
# rwx: user/file owner(user1) has read, write and execute permission
# r-x: associated group(group3) has read and execute permission
# r-x: others have read and execute permission
drwxr-xr-x   7 user1  group3    224 Jun 10  2022 nodejs-tutorials

# -: 'hello_world.txt' is a regular file
# rw-: user/file owner(user1) has read, and write permission
# rw-: associated group(group1) has read and write permission
# r--: others have only read permission
-rw-rw-r--   3 user1  group1    96 Nov 25 00:25 hello_world.txt


# d: 'docker-notes' is a directory
# rwx: user/file owner(user3) has read, write, execute permission
# r--: associated group(group2) has only read permission
# r--: others have only read permission
drwxr--r--  20 user3  group2   640 Oct 23 18:56 docker-notes

# l: 'repos' is a symbolic link or symlink
# rwx: user/file owner(user1) has read, write and execute permission
# r-x: associated group(group2) has read and execute permission
# r--: others have only read permission
lrwxr-xr--   3 user1  group2    96 Sep 12 10:58 repos

# -: 'main.sh' is a regular file
# rwx: user/file owner(user2) has read, write and execute permission
# r-x: group(group1) has read and execute permission
# r-x: others have read and execute permission
-rwxr-xr-x  11 user2  group1   352 Oct  5 11:42 main.sh

```

## How to update file permissions

Changes to file permissions in a Unix-like system can be achieved using the `chmod` command. The `chmod` command expects 2 arguments: the [MODE] and the [FILE]

i.e `$ chmod MODE FILE`

The MODE can be specified using either symbolic or numeric representation but I will only be focusing on symbolic representation as it is easier to grasp and remember:

**Examples**

```sh
$ chmod u+x main.sh # gives execution permission to the user or file owner
$ chmod o-rw main.sh # removes read and write permission from other users
$ chmod g+w main.sh # gives write permission from the group
```

What if we want to grant all 3 permissions to all access levels?

```sh
# This gives read, write, execute permission to the user, group and other users
$ chmod ugo+rwx main.sh
# The above can otherwise be written as:
$ chmod a+rwx main.sh
# 'a' which means all can be used to represent all access levels
```

And that is it, hopefully this article turned out helpful and you are able to get a better understanding of file access permissions. If you found this helpful, let me know by liking, sharing and leaving comments.

Cheers!
