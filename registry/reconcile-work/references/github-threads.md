# Review threads

Use [GitHub mechanics](../../publish-work/references/github-mechanics.md) to resolve one authenticated access path and the exact repository, PR, base, head, and current state. Obtain thread-aware data before replying to or resolving threads.

Fetch all relevant review threads and nested comments, following pagination rather than assuming the first page is complete. Use GraphQL, because the REST comment list does not carry resolution state:

```bash
gh api graphql -F owner=<owner> -F repo=<repo> -F n=<n> -f query='
query($owner:String!,$repo:String!,$n:Int!){repository(owner:$owner,name:$repo){pullRequest(number:$n){
  reviewDecision headRefOid
  reviews(last:20){nodes{author{login} state body}}
  reviewThreads(first:100){pageInfo{hasNextPage endCursor} nodes{id isResolved isOutdated path line
    comments(first:30){nodes{databaseId author{login} body}}}}}}}'
```

Reply in a thread with `gh api repos/<owner>/<repo>/pulls/<n>/comments/<databaseId>/replies -f body='Fixed in <sha>. <What changed>.'`, only after the push so the SHA exists on the remote. Answer points from a review body in one PR comment. Give every actionable thread a disposition: fixed, rationale, deferred, duplicate, outdated, or superseded. Link verified work where useful; create follow-up issues only when requested. Do not resolve a disputed or deferred thread merely because a disposition was recorded. A request to dismiss a comment is not permission to dismiss the reviewer's entire review.

Before an authorized push, inspect approval state and relevant stale-approval policy. Explain a material approval-dismissal effect that has not already been accepted; honor explicit ask-before-push instructions. Batch related accepted repairs where practical. Do not require redundant confirmation for a previously authorized effect.

Reply or resolve only as authorized. Reply with the verified disposition, and resolve only the selected threads whose resolution is supported. Local fixes do not establish that the remote head contains them.
