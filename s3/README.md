# S3

Promise / Pipe-oriented-programming for AWS S3

## See Also

* [AWS Node.JS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)

# Notes

## Delete a bunch of buckets

        Q({
            aws: awsd,
        })
            .then(aws.initialize)
            .then(aws.s3.initialize)
            .then(aws.s3.list_buckets)
            .then(_self => {
                _self.buckets
                    .filter(bucket => bucket.startsWith("ledger-"))
                    .forEach(bucket => {
                        console.log("+", "delete bucket and everything in it", bucket);

                        Q(_self)
                            .then(sd => _.d.add(sd, "bucket", bucket))
                            .then(aws.s3.delete_bucket_objects)
                            .then(aws.s3.delete_bucket)
                            .catch(error => console.log("#", _.error.message(error)))
                    })
            })
            .catch(error => console.log("#", _.error.message(error)))
